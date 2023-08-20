import {
  Epic,
  InputStory,
  InputSubTask,
  IssuePriorityEnum,
  IssueStatusEnum,
  Sprint,
  Story,
  StoryForm,
  SubTask,
  User,
} from "@/models";
import {
  deleteStoryById,
  fetchStoryById,
  getStoryById,
  updateStory,
} from "@/services/StoryService";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import RichEditor from "../global/RichEditor";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEpicsByProjectId } from "@/services/EpicService";
import { fetchSprintsByProjectId } from "@/services/SprintService";
import { fetchAlluser } from "@/services/UserService";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  DropResult,
  DroppableStateSnapshot,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "../global/StrictModeDroppable";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { getAcronym } from "@/utils/helper";
import { v4 as uuid } from "uuid";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import {
  storeSimpleSubTask,
  updateAssigneeSubTask,
  updateDescriptionSubTask,
  updateListSubTaskSequence,
  updateStatusSubTask,
} from "@/services/SubTaskService";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PopoverUsers from "../popovers/PopoverUsers";
import ConfirmDeleteStoryDialog from "./ConfirmDeleteStoryDialog";
import ChipIssueStatus from "../global/ChipIssueStatus";
import PopoverStatus from "../popovers/PopoverStatus";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  padding: `8px 16px`,
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

const getListStyle = ({ isDraggingOver }: DroppableStateSnapshot) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  // padding: grid,
  width: `100%`,
});

export interface FormStoryDialogProps {
  id?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSaved?: () => void;
}

const validationSchema = Yup.object().shape({
  summary: Yup.string().required("Ringkasan harus diisi"),
  description: Yup.string().nullable(),
  priority: Yup.mixed<IssuePriorityEnum>().oneOf(
    Object.values(IssuePriorityEnum)
  ),
  status: Yup.mixed<IssueStatusEnum>().oneOf(Object.values(IssueStatusEnum)),
  assignee: Yup.string().nullable(),
  // sprint: Yup.string().nullable(),
  epic: Yup.string().nullable(),
  story_point: Yup.number().min(0, "Minimal 0").nullable(),
});

const FormStoryDialog: React.FC<FormStoryDialogProps> = (props) => {
  const [story, setStory] = useState<Story | null>(null);
  const [initValueDescription, setInitValueDescription] = useState("");
  const [epics, setEpics] = useState<Epic[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [inputSubTasks, setInputSubTasks] = useState<InputSubTask[]>([]);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const selectedProject = useAppSelector(
    (state) => state.navbarSlice.selectedProject
  );
  const dispatch = useAppDispatch();
  const formik = useFormik<StoryForm>({
    initialValues: {
      summary: "",
      description: "",
      priority: IssuePriorityEnum.Medium,
      status: IssueStatusEnum.Todo,
      assignee_id: "",
      story_point: 0,
      // sprint: "",
      epic_id: "",
    },
    validationSchema,
    async onSubmit(values, formikHelpers) {
      if (props.id != null) {
        await updateStory(values, props.id);
        if (props.onSaved) {
          props.onSaved();
        }
        onCancel();
        dispatch(
          showSnackbar({
            isOpen: true,
            message: "Berhasil disimpan",
            variant: "success",
          })
        );
      }
    },
  });

  function onCancel() {
    // setSubTasks([])
    setInputSubTasks([]);
    setStory(null);
    formik.resetForm();
    props.onClose!();
  }

  async function fetchData() {
    setIsLoading(true);
    if (props.id && selectedProject) {
      const [fetchedEpics, fetchedSprints, tempStory, fetchedUsers] =
        await Promise.all([
          fetchEpicsByProjectId(selectedProject.id),
          fetchSprintsByProjectId(selectedProject.id),
          fetchStoryById(props.id),
          fetchAlluser(),
        ]);
      setEpics(fetchedEpics);
      setSprints(fetchedSprints);
      setListUsers(fetchedUsers);
      if (tempStory) {
        setStory(tempStory);
        if (tempStory) {
          var hahSubTasks: InputSubTask[] = tempStory.sub_tasks.map((st) => ({
            id: st.id,
            description: st.description,
            draft: false,
            isEditing: false,
            assignee_id: st.assignee_id,
            sequence: st.sequence,
            avatarAnchorEl: null,
            statusAnchorEl: null,
            status: st.status
          }));
          setInputSubTasks(hahSubTasks);
        }
        await formik.setValues({
          summary: tempStory.summary,
          description: tempStory.description,
          status: tempStory.status,
          story_point: tempStory.story_point,
          priority: tempStory.priority,
          // sprint: tempStory.sprint_id || "",
          epic_id: tempStory.epic_id || "",
          assignee_id: tempStory.assignee_id || "",
        });
        setInitValueDescription(tempStory.description);
      }
    }
    setIsLoading(false);
  }

  function onAddInputSubTask() {
    const newSubTask: InputSubTask = {
      id: uuid(),
      description: "",
      sequence: inputSubTasks.length + 1,
      draft: true,
      isEditing: false,
      avatarAnchorEl: null,
      statusAnchorEl: null,
      assignee_id: null,
      status: IssueStatusEnum.Todo
    };
    setInputSubTasks([...inputSubTasks, newSubTask]);
  }
  const reorder = (
    list: InputSubTask[],
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
    updateListSubTaskSequence(result);
    return result;
  };

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    const tms = reorder(
      inputSubTasks,
      result.source.index,
      result.destination.index
    );
    setInputSubTasks(tms);
  }

  function findSubTaskById(id: string): SubTask | undefined {
    return story?.sub_tasks.find((a) => a.id == id);
  }

  function onRemoveDraftSubTask(id: string) {
    var newSubtask = inputSubTasks.filter((e) => e.id != id);
    setInputSubTasks(newSubtask);
  }

  async function onSavingDraftSubTask(id: string) {
    // var localSubTasks = [...inputSubTasks];
    // localSubTasks.find((e) => e.id == id)!.draft = false;
    // setInputSubTasks(localSubTasks);
    const selectedSubTask = inputSubTasks.find((e) => e.id == id);
    if (selectedSubTask && props.id) {
      await storeSimpleSubTask(props.id, selectedSubTask.description);

      const tempStory = await fetchStoryById(props.id)
      if (tempStory) {
        var hahSubTasks: InputSubTask[] = tempStory.sub_tasks.map((st) => ({
          id: st.id,
          description: st.description,
          draft: false,
          isEditing: false,
          assignee_id: st.assignee_id,
          sequence: st.sequence,
          avatarAnchorEl: null,
          statusAnchorEl: null,
          status: st.status
        }));
        setInputSubTasks(hahSubTasks);
        setStory(tempStory)
      }
    }
  }

  function onChangeInputDraft(value: string, id: string) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((e) => e.id == id)!.description = value;
    setInputSubTasks(localSubTasks);
  }

  function openPopoverStatus(
    event: React.MouseEvent<HTMLDivElement>,
    subTaskId: string
  ) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((a) => a.id == subTaskId)!.statusAnchorEl =
      event.currentTarget;
    setInputSubTasks(localSubTasks);
  }

  function closePopoverStatus(subTaskId: string) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((a) => a.id == subTaskId)!.statusAnchorEl = null;
    setInputSubTasks(localSubTasks);
  }

  function openPopoverAvatar(
    event: React.MouseEvent<HTMLButtonElement>,
    subTaskId: string
  ) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((a) => a.id == subTaskId)!.avatarAnchorEl =
      event.currentTarget;
    setInputSubTasks(localSubTasks);
  }

  function closePopoverAvatar(subTaskId: string) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((a) => a.id == subTaskId)!.avatarAnchorEl = null;
    setInputSubTasks(localSubTasks);
  }

  function onEditSubTask(subTaskId: string) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((a) => a.id == subTaskId)!.isEditing = true;
    setInputSubTasks(localSubTasks);
  }

  function onCancelEditingSubTask(subTaskId: string) {
    var localSubTasks = [...inputSubTasks];
    const st = localSubTasks.find((a) => a.id == subTaskId);
    if (st) {
      st.isEditing = false;
      st.description = story!.sub_tasks.find(
        (a) => a.id == subTaskId
      )!.description;
      setInputSubTasks(localSubTasks);
    }
  }

  function onSaveEditingSubTask(id: string) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((e) => e.id == id)!.isEditing = false;
    setInputSubTasks(localSubTasks);
    const selectedSubTask = localSubTasks.find((e) => e.id == id);
    if (selectedSubTask) {
      updateDescriptionSubTask(id, selectedSubTask.description).then(() => {
        dispatch(
          showSnackbar({
            isOpen: true,
            variant: "success",
            message: "Keterangan telah diubah",
          })
        );
      });
    }
  }

  async function onSubTaskUpdateAssignee(
    subTaskId: string,
    assigneeId: string
  ) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((e) => e.id == subTaskId)!.assignee_id = assigneeId;
    setInputSubTasks(localSubTasks);
    const newSubTask = await updateAssigneeSubTask(subTaskId, assigneeId);
    var myStory = { ...story } as Story;
    var mySub = myStory.sub_tasks.find((a) => a.id == subTaskId);
    var selectedAssignee = listUsers.find((a) => a.id == assigneeId);
    if (mySub && newSubTask && selectedAssignee) {
      mySub.assignee_id = assigneeId;
      mySub.assignee = selectedAssignee;
      myStory.sub_tasks = [
        ...myStory.sub_tasks.filter((a) => a.id != subTaskId),
        mySub,
      ];

      setStory(myStory);
      closePopoverAvatar(subTaskId);
      dispatch(
        showSnackbar({
          isOpen: true,
          variant: "success",
          message: "Penugas telah diubah",
        })
      );
    }
  }
  async function onSubTaskUpdateStatus(
    subTaskId: string,
    status: IssueStatusEnum
  ) {
    var localSubTasks = [...inputSubTasks];
    localSubTasks.find((e) => e.id == subTaskId)!.status = status;
    setInputSubTasks(localSubTasks);
    const newSubTask = await updateStatusSubTask(subTaskId, status);
    var myStory = { ...story } as Story;
    var mySub = myStory.sub_tasks.find((a) => a.id == subTaskId);
    // var selectedAssignee = listUsers.find((a) => a.id == status);
    if (mySub && newSubTask) {
      mySub.status = status;
      myStory.sub_tasks = [
        ...myStory.sub_tasks.filter((a) => a.id != subTaskId),
        mySub,
      ];

      setStory(myStory);
      closePopoverStatus(subTaskId);
      dispatch(
        showSnackbar({
          isOpen: true,
          variant: "success",
          message: "Status telah diubah",
        })
      );
    }
  }

  function toggleDeleteDialog() {
    if (!story?.sprint?.is_running || !story?.sprint?.actual_end_date) {
      setShowConfirmDeleteDialog(!showConfirmDeleteDialog)
    }
  }

  async function handleDeleteStory() {
    if (props.id && props.onSaved) {
      await deleteStoryById(props.id);
      props.onSaved();
      toggleDeleteDialog()
      onCancel()
      dispatch(showSnackbar({
        isOpen: true, variant: 'success', message: 'Story berhasil dihapus'
      }))
    }
  }

  useEffect(() => {
    if (props.isOpen) {
      fetchData();
    }
    return () => {
      setStory(null);
      setInputSubTasks([]);
    };
  }, [props.isOpen]);

  return (
    <React.Fragment>
      {ConfirmDeleteStoryDialog(showConfirmDeleteDialog, setShowConfirmDeleteDialog, toggleDeleteDialog, handleDeleteStory)}
      <Dialog
        maxWidth="md"
        fullWidth={true}
        open={props.isOpen}
        onClose={props.onClose}
      >
        <DialogTitle>
          {story?.key}
          <IconButton
            aria-label="close"
            onClick={() => onCancel()}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <Stack direction="row" justifyContent="center">
              <CircularProgress />
            </Stack>
          ) : (
            <Stack direction="column" gap={2}>
              <TextField
                label="Ringkasan*"
                name="summary"
                onChange={formik.handleChange}
                value={formik.values.summary}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.summary)}
                helperText={formik.errors.summary}
              />
              <Box>
                <Typography variant="body1">Deskripsi</Typography>
                <RichEditor
                  initialValue={initValueDescription}
                  onChange={(e) => {
                    formik.setFieldValue("description", e);
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body1">Tugas</Typography>
                <DragDropContext onDragEnd={onDragEnd}>
                  <StrictModeDroppable droppableId="subTaskDroppable">
                    {(provided, snapshot) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot)}
                      >
                        {inputSubTasks.map((item, i) => {
                          if (item.isEditing && !snapshot.isDraggingOver) {
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
                                  label="Tugas butuh dikerjakan ?"
                                  fullWidth
                                  value={item.description}
                                  onChange={(e) =>
                                    onChangeInputDraft(
                                      e.currentTarget.value,
                                      item.id
                                    )
                                  }
                                />
                                <Stack direction="row" gap={1}>
                                  <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={() =>
                                      onCancelEditingSubTask(item.id)
                                    }
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      onSaveEditingSubTask(item.id)
                                    }
                                    variant="contained"
                                  >
                                    Simpan
                                  </Button>
                                </Stack>
                              </Box>
                            );
                          }
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
                                  label="Tugas butuh dikerjakan ?"
                                  fullWidth
                                  value={item.description}
                                  onChange={(e) =>
                                    onChangeInputDraft(
                                      e.currentTarget.value,
                                      item.id
                                    )
                                  }
                                />
                                <Stack direction="row" gap={1}>
                                  <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={() =>
                                      onRemoveDraftSubTask(item.id)
                                    }
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    onClick={() => onSavingDraftSubTask(item.id)}
                                    variant="contained"
                                  >
                                    Simpan
                                  </Button>
                                </Stack>
                              </Box>
                            );
                          }
                          return (
                            <React.Fragment key={i}>
                              <Draggable draggableId={item.id} index={i}>
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    <Stack
                                      gap={1}
                                      direction="row"
                                      alignItems="center"
                                    >
                                      <AssignmentTurnedInIcon
                                        sx={{
                                          color: "primary.main",
                                          fontSize: 24,
                                        }}
                                      />
                                      <Typography
                                        variant="body1"
                                        onDoubleClick={() =>
                                          onEditSubTask(item.id)
                                        }
                                      >
                                        {item.description}
                                      </Typography>
                                    </Stack>
                                    <Stack
                                      gap={1}
                                      direction="row"
                                      alignItems="center"
                                    >
                                      <ChipIssueStatus
                                        onClick={(e) =>
                                          openPopoverStatus(e, item.id)
                                        }
                                        label={findSubTaskById(item.id)?.status}
                                        status={findSubTaskById(item.id)!.status}
                                        clickable
                                      />
                                      {findSubTaskById(item.id)?.assignee !=
                                      null ? (
                                        <>
                                          <IconButton
                                          onClick={(e) =>
                                            openPopoverAvatar(e, item.id)
                                          }
                                          >
                                            <Avatar>
                                              {getAcronym(
                                                findSubTaskById(item.id)?.assignee
                                                  ?.name!
                                              ).substring(0, 2)}
                                            </Avatar>
                                          </IconButton>
                                        </>
                                      ) : (
                                        <IconButton
                                          onClick={(e) =>
                                            openPopoverAvatar(e, item.id)
                                          }
                                          size="large"
                                        >
                                          <AccountCircleRoundedIcon fontSize="large" />
                                        </IconButton>
                                      )}
                                      <Typography variant="body1">
                                        {findSubTaskById(item.id)?.key}
                                      </Typography>
                                    </Stack>
                                  </Box>
                                )}
                              </Draggable>
                              {PopoverUsers(item, closePopoverAvatar, listUsers, onSubTaskUpdateAssignee)}
                              {PopoverStatus(item, closePopoverStatus, onSubTaskUpdateStatus)}
                            </React.Fragment>
                          );
                        })}
                        {provided.placeholder}
                      </Box>
                    )}
                  </StrictModeDroppable>
                  { (story?.sprint?.actual_end_date == null) && (
                    <Button variant="text" onClick={() => onAddInputSubTask()}>
                      + Buat Tugas
                    </Button>
                  )}
                </DragDropContext>
              </Box>
              <Grid container direction="row" rowGap={2}>
                <Grid item md={6}>
                  <Typography variant="body1">Status</Typography>
                </Grid>
                <Grid item md={3}>
                  <Select
                    fullWidth
                    name="status"
                    onChange={formik.handleChange}
                    value={formik.values.status}
                  >
                    {Object.values(IssueStatusEnum).map((e, i) => (
                      <MenuItem key={i} value={e}>
                        {e.replaceAll("_", " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">Ditugaskan</Typography>
                </Grid>
                <Grid item md={3}>
                  {listUsers.length > 0 && (
                    <Select
                      fullWidth
                      name="assignee_id"
                      onChange={formik.handleChange}
                      value={formik.values.assignee_id || ""}
                    >
                      {listUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">Pembuat</Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">{story?.user?.name}</Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">Story Point</Typography>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    fullWidth
                    type="number"
                    InputProps={{
                      inputProps: {
                        min: 0,
                      },
                    }}
                    placeholder="Bilangan fibonacci"
                    value={formik.values.story_point}
                    name="story_point"
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.story_point)}
                    helperText={formik.errors.story_point}
                  />
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">Prioritas</Typography>
                </Grid>
                <Grid item md={3}>
                  <Select
                    fullWidth
                    name="priority"
                    onChange={formik.handleChange}
                    value={formik.values.priority}
                  >
                    {Object.values(IssuePriorityEnum).map((a, i) => (
                      <MenuItem key={i} value={a}>
                        {a}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body1">Epic</Typography>
                </Grid>
                <Grid item md={3}>
                  {epics.length > 0 && (
                    <Select
                      fullWidth
                      name="epic_id"
                      value={formik.values.epic_id}
                      onChange={formik.handleChange}
                    >
                      {epics.map((a, i) => (
                        <MenuItem key={i} value={a.id}>
                          {a.key}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: (!story?.sprint?.is_running && story?.sprint?.actual_end_date == null) ? 'space-between' : 'flex-end' }}
        >
        {(!story?.sprint?.is_running && story?.sprint?.actual_end_date == null) && (
          <Button
            onClick={() => toggleDeleteDialog()}
            variant="outlined"
            color="error">
            Hapus Story
          </Button>
        )}
        {story?.sprint?.actual_end_date == null && (
          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onCancel()}
            >
              Batal
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={formik.isSubmitting}
              onClick={() => formik.submitForm()}
            >
              Simpan
            </LoadingButton>
          </Stack>
        )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default FormStoryDialog;


