import React, { useMemo, useState } from "react";
import BackofficeBreacrumbs, {
  LinkBreadcrumb,
} from "@/components/global/BackofficeBreacrumbs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Box,
  Button,
  Stack,
  Grid,
  SxProps,
  TextField,
  Theme,
  Typography,
  Paper,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  DropResult,
  Droppable,
  DroppableStateSnapshot,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { OnDragEndResponder } from "react-beautiful-dnd";
import { StrictModeDroppable } from "@/components/global/StrictModeDroppable";
import {
  fetchSprintWithStoriesByProjectId,
  fetchStoryByProjectId,
  storeSimpleStory,
  updateListStory,
} from "@/services/BacklogService";
import { DroppableSprint, InputStory, Sprint, Story } from "@/models";
import { fetchStoriesByProject } from "@/services/StoryService";
import { v4 as uuid } from "uuid";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FormStoryDialog, {
  FormStoryDialogProps,
} from "@/components/dialogs/FormStoryDialog";
import { getAcronym } from "@/utils/helper";
import dayjs from "dayjs";
import FormSprintDialog from "@/components/dialogs/FormSprintDialog";
import { endSprint, startSprint } from "@/services/SprintService";
import EpicDialog from "@/components/dialogs/EpicDialog";
import { showSnackbar } from "@/store/slices/snackbarSlice";
const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  padding: `8px ${grid * 2}px`,
  // border: `1px solid #dfe1e6`,
  outline: "1px solid #dfe1e6",
  marginTop: 1,
  display: "flex",
  alignItems: "center",

  // Custom styles
  justifyContent: "space-between",
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = ({ isDraggingOver }: DroppableStateSnapshot): React.CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  // padding: grid,
  width: `100%`,
  cursor: 'move'
});

const Backlogs: React.FC = () => {
  const selectedProject = useAppSelector(
    (state) => state.navbarSlice.selectedProject
  );
  const [crumbs, setCrumbs] = useState<LinkBreadcrumb[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [inputSprintStories, setInputSprintStories] = useState<DroppableSprint[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [inputBacklogStories, setInputBacklogStories] = useState<InputStory[]>([]);
  const [formStoryDialog, setFormStoryDialog] =
    useState<FormStoryDialogProps>({
      isOpen: false,
    });
  const [showSprintDialog, setShowSprintDialog] = useState(false)
  const [showEpicDialog, setShowEpicDialog] = useState(false)
  const dispatch = useAppDispatch();
  const reorder = (
    list: InputStory[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((result, i) => {
      result.sequence = i + 1;
      return result;
    });
    return result;
  };

  function move(
    source: InputStory[],
    destination: InputStory[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ): Map<String, InputStory[]> {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    sourceClone.map((v, k) => {
      v.sequence = k + 1;
      return v;
    });
    destClone.map((v, k) => {
      v.sequence = k + 1;
      return v;
    });

    const result = new Map<String, InputStory[]>();
    result.set(droppableSource.droppableId, sourceClone);
    result.set(droppableDestination.droppableId, destClone);
    return result;
  }

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!result.destination) {
      return;
    }

    const sInd = source.droppableId;
    const dInd = destination!.droppableId;
    if (sInd == dInd) {
      // reorder
      if (sInd == "droppable-backlog" && dInd == "droppable-backlog") {
        const tms = reorder(
          inputBacklogStories,
          result.source.index,
          result.destination.index
        );
        setInputBacklogStories(tms);
        updateListStory(tms);
      } else {
        let spr = inputSprintStories.find((s) => s.id == sInd);
        if (spr) {
          const tms = reorder(
            spr.inputStories,
            result.source.index,
            result.destination.index
          );
          updateListStory(tms, sInd);
          inputSprintStories.find((s) => s.id == sInd)!.inputStories = tms;
          setInputSprintStories(inputSprintStories);
        }
      }
    } else { // move
      var sourceStories: InputStory[] = [];
      var destStories: InputStory[] = [];
      if (sInd == "droppable-backlog") {
        sourceStories = inputBacklogStories;
      } else {
        let lookISS = inputSprintStories.find((s) => s.id == sInd);
        sourceStories = lookISS?.inputStories || [];
      }
      if (dInd == "droppable-backlog") {
        destStories = inputBacklogStories;
      } else {
        let lookDest = inputSprintStories.find((s) => s.id == dInd);
        destStories = lookDest?.inputStories || [];
      }

      if (destination) {
        const result = move(sourceStories, destStories, source, destination);
        const resultSource = result.get(sInd);
        const resultDestination = result.get(dInd);
        if (resultSource && resultDestination) {
          sourceStories = resultSource;
          destStories = resultDestination;
          if (sInd == "droppable-backlog") {
            setInputBacklogStories(sourceStories);
            updateListStory(sourceStories);
          } else {
            inputSprintStories.find((s) => s.id == sInd)!.inputStories =
              resultSource;
            setInputSprintStories(inputSprintStories);
            updateListStory(resultSource, sInd);
          }

          if (dInd == "droppable-backlog") {
            setInputBacklogStories(destStories);
            updateListStory(destStories);
          } else {
            inputSprintStories.find((s) => s.id == dInd)!.inputStories =
              resultDestination;
            updateListStory(resultDestination, dInd);
            setInputSprintStories(inputSprintStories);
          }
        }
      }
    }
  }

  async function fetchData() {
    if (selectedProject) {
      var listSprints = await fetchSprintWithStoriesByProjectId(
        selectedProject.id
      );
      setSprints(listSprints);
      var inputSprints: DroppableSprint[] = listSprints.map((x) => {
        return {
          ...x,
          inputStories: x.stories.map<InputStory>((y) => ({
            id: y.id,
            draft: false,
            sequence: y.sequence,
            summary: y.summary,
            is_backlog: y.sprint_id != null ? false : true,
            sprint_id: y.sprint_id,
          })),
        };
      });
      setInputSprintStories(inputSprints);
      const backlogStories = await fetchStoriesByProject({
        projectId: selectedProject.id,
        showBacklogOnly: true,
      });
      setStories(backlogStories);
      setInputBacklogStories(
        backlogStories.map((stry) => ({
          id: stry.id,
          summary: stry.summary,
          sequence: stry.sequence,
          draft: false,
          is_backlog: true,
          sprint_id: null,
        }))
      );
    }
  }

  React.useEffect(() => {
    setCrumbs([
      {
        title: "Projects",
        link: "/projects",
      },
      {
        title: selectedProject!.name,
        link: "/settings",
      },
      {
        title: `${selectedProject!.key} board`,
        link: "/backlog",
      },
    ]);
    fetchData();
  }, []);

  async function onAddInputStory() {
    var newInputStory: InputStory = {
      id: uuid(),
      summary: "",
      sequence: inputBacklogStories.length + 1,
      draft: true,
      is_backlog: true,
      sprint_id: null,
    };
    setInputBacklogStories([...inputBacklogStories, newInputStory]);
  }

  function onRemoveDraftStory(id: string) {
    var newStories = inputBacklogStories.filter((e) => e.id != id);
    setInputBacklogStories(newStories);
  }

  async function onSaveDraftStory(id: string) {
    // var localStories = [...inputBacklogStories];
    // localStories.find((e) => e.id == id)!.draft = false;
    // setInputBacklogStories(localStories);
    const selectedStory = inputBacklogStories.find((e) => e.id == id);
    if (selectedStory && selectedProject) {
      storeSimpleStory(
        selectedStory.id,
        selectedStory.summary,
        selectedProject.id
      );
      fetchData()
    }
  }

  function onChangeInputDraft(value: string, id: string) {
    var localStories = [...inputBacklogStories];
    localStories.find((e) => e.id == id)!.summary = value;
    setInputBacklogStories(localStories);
  }

  function findStoryById(id: string) {
    return stories.find((e) => e.id == id);
  }
  function findStoryInSprintById(sprintId: string, storyId: string) {
    return StoryInSprint.find((e) => e.id == sprintId)?.stories.find(x => x.id == storyId);
  }

  function openFormStoryDialog(id: string) {
    setFormStoryDialog({ ...formStoryDialog, isOpen: true, id });
  }

  function closeFormStoryDialog() {
    setFormStoryDialog({ ...formStoryDialog, isOpen: false });
  }

  function toggleFormSprintDialog() {
    setShowSprintDialog(!showSprintDialog);
  }

  function onSuccessStory () {
    toggleFormSprintDialog();
    fetchData();
  }

  const StoryInSprint = useMemo(() => {
    return inputSprintStories;
  }, [inputSprintStories])

  async function onStartSprint(sprintId: string) {
    await startSprint(sprintId);
    dispatch(showSnackbar({
      isOpen: true,
      message: "Sprint telah dimulai",
      variant: 'success'
    }))
    fetchData();
  }
  async function onEndSprint(sprintId: string) {
    await endSprint(sprintId);
    fetchData();
  }

  function toggleEpicDialog() {
    setShowEpicDialog(!showEpicDialog);
  }

  return (
    <Grid container>
      <FormStoryDialog
        id={formStoryDialog.id}
        isOpen={formStoryDialog.isOpen}
        onClose={() => closeFormStoryDialog()}
        onSaved={() => fetchData()}
      />
      <FormSprintDialog
        isOpen={showSprintDialog}
        onClose={toggleFormSprintDialog}
        onSuccess={onSuccessStory}
      />
      <EpicDialog
        isOpen={showEpicDialog}
        onClose={toggleEpicDialog}
      />
      <Grid item md={12}>
        <BackofficeBreacrumbs links={crumbs} />
      </Grid>
      <Grid item md={12}>
        <Typography variant="h1">Backlog</Typography>
      </Grid>
      <Grid container item md={12} lg={12} gap={2}>
        <Grid container justifyContent="flex-end" item lg={12} md={12}>
          <Grid item md={2} container columnGap={1} justifyContent="flex-end">
            <Button
              variant="contained"
              color="info"
              onClick={() => toggleEpicDialog()}
            >
              Epics
            </Button>
            <Button
              variant="contained"
              onClick={() => toggleFormSprintDialog()}
            >
              Buat Sprint
            </Button>
          </Grid>
        </Grid>
        <DragDropContext onDragEnd={onDragEnd}>
          {inputSprintStories.map((spr, k) => (
            <Grid key={spr.id} container item md={12} sm={12}>
              <Grid item md={6}>
                <Stack spacing={2} direction="row">
                  <Typography sx={{ fontWeight: 600 }}>
                    {spr.sprint_name}
                  </Typography>
                  <Typography>
                    {StoryInSprint[k].inputStories.length} Stories
                  </Typography>
                </Stack>
                <Stack direction="column" spacing={1}>
                  <Typography>{spr.sprint_goal}</Typography>
                  <Typography>
                    {" "}
                    {dayjs(spr.start_date).format("DD MMMM YYYY")} -{" "}
                    {dayjs(spr.end_date).format("DD MMMM YYYY")}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item md={6} justifyContent="flex-end" container>
                <Stack direction="column" justifyContent="flex-end" py={2}>
                  {(spr.is_running && spr.actual_end_date == null) && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onEndSprint(spr.id)}
                    >
                      Selesaikan Sprint</Button>
                  )}
                  {(!spr.is_running && spr.actual_start_date == null) && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onStartSprint(spr.id)}
                    >
                      Mulai Sprint
                    </Button>
                  )}
                  {(!spr.is_running && spr.actual_start_date && spr.actual_end_date) && (
                    <Typography variant="body1" color="darkgreen">Sprint Selesai</Typography>
                  )}
                </Stack>
              </Grid>
              <StrictModeDroppable droppableId={spr.id}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                  >
                    {spr.inputStories.map((item, index) => {
                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Box
                              onClick={() => openFormStoryDialog(item.id)}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <Stack gap={1} direction="row">
                                <Paper
                                  sx={{
                                    backgroundColor: "primary.main",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <BookmarkIcon
                                    sx={{ color: "white", fontSize: 16 }}
                                  />
                                </Paper>
                                {item.summary}
                              </Stack>
                              <Stack gap={1} direction="row">
                                {findStoryInSprintById(spr.id, item.id)?.epic != null && (
                                  <Tooltip title={findStoryInSprintById(spr.id, item.id)?.epic.summary}>
                                    <Chip color="info" label={findStoryInSprintById(spr.id, item.id)?.epic?.key}/>
                                  </Tooltip>
                                )}
                                {findStoryInSprintById(spr.id, item.id)?.assignee != null && (
                                  <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {getAcronym(
                                      findStoryInSprintById(spr.id, item.id)?.assignee?.name!
                                    ).substring(0, 2)}
                                  </Avatar>
                                )}
                                <Typography variant="body1">
                                  {findStoryInSprintById(spr.id, item.id)?.key}
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "secondary.main",
                                    padding: "4px",
                                    borderRadius: 1,
                                    minWidth: "20px",
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    color="white"
                                    textAlign="center"
                                  >
                                    {findStoryInSprintById(spr.id, item.id)?.story_point || "-"}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </StrictModeDroppable>
            </Grid>
          ))}
          <Grid item md={12} sm={12}>
            <Stack direction="row" spacing={2}>
              <Typography sx={{ fontWeight: 600 }}>Backlog</Typography>
              <Typography>{inputBacklogStories.length} Stories</Typography>
            </Stack>
            <StrictModeDroppable droppableId="droppable-backlog">
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot)}
                >
                  {inputBacklogStories.map((item, index) => {
                    if (item.draft && !snapshot.isDraggingOver) {
                      return (
                        <Box
                          key={item.id}
                          sx={{
                            outline: "1px solid #dfe1e6",
                            marginTop: "1px",
                            background: "white",
                            padding: `8px`,
                          }}
                        >
                          <TextField
                            size="small"
                            variant="outlined"
                            label="Apa yang butuh dikerjakan ?"
                            fullWidth
                            value={item.summary}
                            onChange={(e) =>
                              onChangeInputDraft(e.currentTarget.value, item.id)
                            }
                            helperText="Story baru"
                          />
                          <Stack direction="row" gap={1}>
                            <Button
                              variant="text"
                              color="secondary"
                              onClick={() => onRemoveDraftStory(item.id)}
                            >
                              Batal
                            </Button>
                            <Button
                              onClick={() => onSaveDraftStory(item.id)}
                              variant="contained"
                            >
                              Simpan
                            </Button>
                          </Stack>
                        </Box>
                      );
                    }
                    return (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            onClick={() => openFormStoryDialog(item.id)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Stack gap={1} direction="row">
                              <Paper
                                sx={{
                                  backgroundColor: "primary.main",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <BookmarkIcon
                                  sx={{ color: "white", fontSize: 16 }}
                                />
                              </Paper>
                              {item.summary}
                            </Stack>
                            <Stack gap={1} direction="row">
                              {findStoryById(item.id)?.assignee != null && (
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                  {getAcronym(
                                    findStoryById(item.id)?.assignee?.name!
                                  ).substring(0, 2)}
                                </Avatar>
                              )}
                              <Typography variant="body1">
                                {findStoryById(item.id)?.key}
                              </Typography>
                              <Box
                                sx={{
                                  backgroundColor: "secondary.main",
                                  padding: "4px",
                                  borderRadius: 1,
                                  minWidth: "20px",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="white"
                                  textAlign="center"
                                >
                                  {findStoryById(item.id)?.story_point || "-"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </StrictModeDroppable>
            <Button variant="text" onClick={() => onAddInputStory()}>
              + Buat Story
            </Button>
          </Grid>
        </DragDropContext>
      </Grid>
    </Grid>
  );
};

export default Backlogs;
