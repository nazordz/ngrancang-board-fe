import React, { useEffect, useMemo, useState } from "react";
import BackofficeBreacrumbs, {
  LinkBreadcrumb,
} from "@/components/global/BackofficeBreacrumbs";
import { useAppSelector } from "@/store/hooks";
import { Avatar, Box, Button, Grid, Stack, Typography } from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
  DroppableStateSnapshot,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import { createActiveSprintLog, endSprint, fetchActiveSprint } from "@/services/SprintService";
import { InputStory, IssueStatusEnum, Sprint, Story } from "@/models";
import { StrictModeDroppable } from "@/components/global/StrictModeDroppable";
import { enumFromStringValue, getAcronym } from "@/utils/helper";
import FormStoryDialog, {
  FormStoryDialogProps,
} from "@/components/dialogs/FormStoryDialog";
import {
  updateListStory,
  updateListStoryInActiveSprint,
} from "@/services/BacklogService";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { useNavigate } from "react-router-dom";

const ActiveSprint: React.FC = () => {
  const [crumbs, setCrumbs] = useState<LinkBreadcrumb[]>([]);
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [todoStories, setTodoStories] = useState<Story[]>([]);
  const [inProgressStories, setInProgressStories] = useState<Story[]>([]);
  const [reviewStories, setReviewStories] = useState<Story[]>([]);
  const [doneStories, setDoneStories] = useState<Story[]>([]);
  const selectedProject = useAppSelector(
    (state) => state.navbarSlice.selectedProject
  );
  const [formStoryDialog, setFormStoryDialog] = useState<FormStoryDialogProps>({
    isOpen: false,
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const grid = 8;
  const navigate = useNavigate()
  useEffect(() => {
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
        link: "/active-sprint",
      },
    ]);
    fetchData();
  }, []);

  async function fetchData() {
    if (selectedProject) {
      const fetchedSprint = await fetchActiveSprint(selectedProject?.id);
      setSprint(fetchedSprint);
      if (fetchedSprint) {
        setTodoStories(
          fetchedSprint.stories
            .filter((s) => s.status == IssueStatusEnum.Todo)
            .sort((a, b) => a.sequence - b.sequence)
        );
        setInProgressStories(
          fetchedSprint.stories
            .filter((s) => s.status == IssueStatusEnum.InProgress)
            .sort((a, b) => a.sequence - b.sequence)
        );
        setReviewStories(
          fetchedSprint.stories
            .filter((s) => s.status == IssueStatusEnum.Review)
            .sort((a, b) => a.sequence - b.sequence)
        );
        setDoneStories(
          fetchedSprint.stories
            .filter((s) => s.status == IssueStatusEnum.Done)
            .sort((a, b) => a.sequence - b.sequence)
        );
      }
    }
  }

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): React.CSSProperties => ({
    // some basic styles to make the items look a bit nicer
    // userSelect: "none",
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,
    padding: `8px ${grid * 2}px`,
    // border: `1px solid #dfe1e6`,
    outline: "1px solid #dfe1e6",
    marginTop: 1,
    // display: "flex",
    // alignItems: "center",
    // minHeight: 60,
    // Custom styles
    // justifyContent: "space-between",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "white",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = ({
    isDraggingOver,
  }: DroppableStateSnapshot): React.CSSProperties => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    // padding: grid,
    width: `100%`,
    cursor: "move",
  });

  function getListByDragging(droppableId: string) {
    if (droppableId == IssueStatusEnum.Todo) {
      return todoStories;
    }
    if (droppableId == IssueStatusEnum.InProgress) {
      return inProgressStories;
    }
    if (droppableId == IssueStatusEnum.Review) {
      return reviewStories;
    }
    if (droppableId == IssueStatusEnum.Done) {
      return doneStories;
    }
    return [];
  }

  function setDraggedList(droppableId: string, list: Story[]) {
    if (droppableId == IssueStatusEnum.Todo) {
      setTodoStories(list);
    }
    if (droppableId == IssueStatusEnum.InProgress) {
      setInProgressStories(list);
    }
    if (droppableId == IssueStatusEnum.Review) {
      setReviewStories(list);
    }
    if (droppableId == IssueStatusEnum.Done) {
      setDoneStories(list);
    }
  }

  function reorder(list: Story[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((result, i) => {
      result.sequence = i + 1;
      return result;
    });
    return result;
  }

  function move(
    source: Story[],
    destination: Story[],
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ): Map<String, Story[]> {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    sourceClone.map((v, k) => {
      v.sequence = k + 1;
      var statusString = enumFromStringValue(
        IssueStatusEnum,
        droppableSource.droppableId
      );
      if (statusString) {
        v.status = statusString;
      }
      return v;
    });
    destClone.map((v, k) => {
      v.sequence = k + 1;
      var statusString = enumFromStringValue(
        IssueStatusEnum,
        droppableDestination.droppableId
      );
      if (statusString) {
        v.status = statusString;
      }
      return v;
    });

    const result = new Map<String, Story[]>();
    result.set(droppableSource.droppableId, sourceClone);
    result.set(droppableDestination.droppableId, destClone);
    return result;
  }

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) return;
    const selectedStoryId = result.draggableId;
    const selectedStory = sprint?.stories.find(s => s.id == result.draggableId)

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getListByDragging(destination.droppableId),
        source.index,
        destination!.index
      );
      if (sprint) {
        setDraggedList(destination.droppableId, items);
        updateListStoryInActiveSprint(items, sprint?.id);
      }
    } else {
      const result = move(
        getListByDragging(source.droppableId),
        getListByDragging(destination.droppableId),
        source,
        destination
      );
      const resultSource = result.get(source.droppableId);
      const resultDestination = result.get(destination.droppableId);
      if (resultSource && resultDestination && sprint) {
        setDraggedList(source.droppableId, resultSource);
        updateListStoryInActiveSprint(resultSource, sprint?.id);

        setDraggedList(destination.droppableId, resultDestination);
        updateListStoryInActiveSprint(resultDestination, sprint?.id);

        createActiveSprintLog({
          sprint_id: sprint!.id,
          story_id: selectedStoryId,
          status: enumFromStringValue(IssueStatusEnum, destination.droppableId)!,
          story_point: selectedStory?.story_point || 0,
        })
      }
    }
  }

  function openFormStoryDialog(id: string) {
    setFormStoryDialog({ ...formStoryDialog, isOpen: true, id });
  }

  function closeFormStoryDialog() {
    setFormStoryDialog({ ...formStoryDialog, isOpen: false });
  }

  function toggleFinishSprintDialog() {
    setShowConfirmDialog(!showConfirmDialog)
  }

  async function finishSprint() {
    if (sprint) {
      toggleFinishSprintDialog();
      await endSprint(sprint?.id);
      navigate('/backlog')
    }
  }

  return (
    <Grid container>
      <FormStoryDialog
        id={formStoryDialog.id}
        isOpen={formStoryDialog.isOpen}
        onClose={() => closeFormStoryDialog()}
        onSaved={() => fetchData()}
      />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Anda yakin untuk mengakhiri sprint?"
        message="Story yang belum done akan dipindahkan ke backlog"
        onConfirm={() => finishSprint()}
        onCancel={() => toggleFinishSprintDialog()}
      />
      <Grid item md={12}>
        <BackofficeBreacrumbs links={crumbs} />
      </Grid>
      <Grid item md={6}>
        <Typography variant="h1">Active Sprint</Typography>
      </Grid>
      <Grid item md={6} sx={{display: 'flex', justifyContent: 'flex-end'}}>
        {sprint && (
          <Button
            onClick={() => toggleFinishSprintDialog()}
            variant="contained"
            color="primary"
          >
            Selesaikan Sprint
          </Button>
        )}
      </Grid>
      <Grid item md={12} lg={12} mt={2}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container columnSpacing={2}>
            <Grid item md={3}>
              <Typography>TODO</Typography>
              <StrictModeDroppable droppableId={IssueStatusEnum.Todo}>
                {(provided, snapshot) => (
                  <Stack
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                    direction="column"
                  >
                    {todoStories.map((story, index) => (
                      <Draggable
                        key={story.id}
                        draggableId={story.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Grid
                            onClick={() => openFormStoryDialog(story.id)}
                            container
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Grid item md={6}>
                              <Typography variant="body1">
                                {story.summary}
                              </Typography>
                            </Grid>
                            <Grid item md={6}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={1}
                              >
                                <Typography variant="body2">
                                  {story.key}
                                </Typography>
                                {story.assignee && (
                                  <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {getAcronym(story.assignee.name).slice(
                                      0,
                                      2
                                    )}
                                  </Avatar>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Stack>
                )}
              </StrictModeDroppable>
            </Grid>
            <Grid item md={3}>
              <Typography>IN PROGRESS</Typography>
              <StrictModeDroppable droppableId={IssueStatusEnum.InProgress}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                  >
                    {inProgressStories.map((story, key) => (
                      <Draggable
                        key={story.id}
                        draggableId={story.id}
                        index={key}
                      >
                        {(provided, snapshot) => (
                          <Grid
                            onClick={() => openFormStoryDialog(story.id)}
                            container
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Grid item md={6}>
                              <Typography variant="body1">
                                {story.summary}
                              </Typography>
                            </Grid>
                            <Grid item md={6}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={1}
                              >
                                <Typography variant="body2">
                                  {story.key}
                                </Typography>
                                {story.assignee && (
                                  <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {getAcronym(story.assignee.name).slice(
                                      0,
                                      2
                                    )}
                                  </Avatar>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </StrictModeDroppable>
            </Grid>
            <Grid item md={3}>
              <Typography>REVIEW</Typography>
              <StrictModeDroppable droppableId={IssueStatusEnum.Review}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                  >
                    {reviewStories.map((story, key) => (
                      <Draggable
                        key={story.id}
                        draggableId={story.id}
                        index={key}
                      >
                        {(provided, snapshot) => (
                          <Grid
                            onClick={() => openFormStoryDialog(story.id)}
                            container
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Grid item md={6}>
                              <Typography variant="body1">
                                {story.summary}
                              </Typography>
                            </Grid>
                            <Grid item md={6}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={1}
                              >
                                <Typography variant="body2">
                                  {story.key}
                                </Typography>
                                {story.assignee && (
                                  <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {getAcronym(story.assignee.name).slice(
                                      0,
                                      2
                                    )}
                                  </Avatar>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </StrictModeDroppable>
            </Grid>
            <Grid item md={3}>
              <Typography>DONE</Typography>
              <StrictModeDroppable droppableId={IssueStatusEnum.Done}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot)}
                  >
                    {doneStories.map((story, key) => (
                      <Draggable
                        key={story.id}
                        draggableId={story.id}
                        index={key}
                      >
                        {(provided, snapshot) => (
                          <Grid
                            onClick={() => openFormStoryDialog(story.id)}
                            container
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Grid item md={6}>
                              <Typography variant="body1">
                                {story.summary}
                              </Typography>
                            </Grid>
                            <Grid item md={6}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={1}
                              >
                                <Typography variant="body2">
                                  {story.key}
                                </Typography>
                                {story.assignee && (
                                  <Avatar sx={{ bgcolor: "primary.main" }}>
                                    {getAcronym(story.assignee.name).slice(
                                      0,
                                      2
                                    )}
                                  </Avatar>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </StrictModeDroppable>
            </Grid>
          </Grid>
        </DragDropContext>
      </Grid>
    </Grid>
  );
};

export default ActiveSprint;
