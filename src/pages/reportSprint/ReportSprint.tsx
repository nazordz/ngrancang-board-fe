import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import BackofficeBreacrumbs, {
  LinkBreadcrumb,
} from "@/components/global/BackofficeBreacrumbs";
import { useAppSelector } from "@/store/hooks";
import { ActiveSprintLog, Sprint } from "@/models";
import {
  fetchEndedSprintsByProjectId,
  fetchSprintById,
  fetchSprintsByProjectId,
  fetchVelocityReport,
} from "@/services/SprintService";
import ChipIssueStatus from "@/components/global/ChipIssueStatus";
import dayjs from "dayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FormStoryDialog, {
  FormStoryDialogProps,
} from "@/components/dialogs/FormStoryDialog";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportSprint = () => {
  const [crumbs, setCrumbs] = useState<LinkBreadcrumb[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const selectedProject = useAppSelector(
    (state) => state.navbarSlice.selectedProject
  );
  const [formStoryDialog, setFormStoryDialog] = useState<FormStoryDialogProps>({
    isOpen: false,
  });

  const [tabIndex, setTabIndex] = useState("0");

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
      var fetchedSprints = await fetchEndedSprintsByProjectId(
        selectedProject.id
      );
      console.log(fetchedSprints)
      setSprints(fetchedSprints);
      // var fechedReports = await fetchVelocityReport(selectedProject.id)
    }
  }

  async function displayReport(sprintId: string) {
    var fetchedSprint = await fetchSprintById(sprintId);
    if (fetchedSprint) {
      setSelectedSprint(fetchedSprint);
    }
  }

  function onChangeSprintId(e: SelectChangeEvent<string>) {
    setSelectedSprintId(e.target.value);
    displayReport(e.target.value);
  }

  function getOldestAndLatestDates(logs: ActiveSprintLog[]) {
    const sortedDates = logs.sort(
      (a, b) => dayjs(a.created_at).second() - dayjs(b.created_at).second()
    );

    var oldest = sortedDates.length > 0 ? sortedDates[0] : null;
    var latest =
      sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;
    if (oldest?.is_start == false) {
      oldest = null;
    }

    return { oldest, latest };
  }

  function closeStoryDialog() {
    setFormStoryDialog({ ...formStoryDialog, isOpen: false });
  }

  function openStoryDialog(storyId: string) {
    setFormStoryDialog({ ...formStoryDialog, isOpen: true, id: storyId });
  }

  function TabSprintReport() {
    return (
      <Grid container>
        <Grid item md={6}>
          <Typography variant="h1">Sprint Report</Typography>
        </Grid>
        <Grid item md={6} container justifyContent="flex-end">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="label-sprint">Pilih Sprint</InputLabel>
            <Select
              labelId="label-sprint"
              label="Pilih Sprint"
              value={selectedSprintId}
              onChange={onChangeSprintId}
            >
              {sprints.map((spr, key) => (
                <MenuItem key={key} value={spr.id}>
                  {spr.sprint_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={12}>
          <Typography variant="h5">Completed Stories</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  {selectedSprint != null ? (
                    <Stack direction="row" spacing={1}>
                      <Typography>Story Point</Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "secondary.main",
                        }}
                      >
                        {selectedSprint?.plan_story_point}
                      </Typography>
                      <ArrowForwardIcon
                        sx={{
                          color: "secondary.main",
                        }}
                      />
                      <Typography>
                        {selectedSprint?.actual_story_point}
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography>Story Point</Typography>
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedSprint == null ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Pilih Sprint dahulu
                  </TableCell>
                </TableRow>
              ) : (
                selectedSprint.stories.map((stor, key) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Button
                        onClick={() => openStoryDialog(stor.id)}
                        variant="text"
                        sx={{ color: "primary.main" }}
                      >
                        {stor.key}
                      </Button>
                    </TableCell>
                    <TableCell>{stor.summary}</TableCell>
                    <TableCell>{stor.priority}</TableCell>
                    <TableCell>
                      <ChipIssueStatus
                        label={stor.status}
                        status={stor.status}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row">
                        <Typography
                          variant="body1"
                          sx={{
                            color: "secondary.main",
                          }}
                        >
                          {getOldestAndLatestDates(stor.active_sprint_logs)
                            ?.oldest?.story_point || "-"}
                        </Typography>
                        <ArrowForwardIcon
                          sx={{
                            color: "secondary.main",
                          }}
                        />
                        <Typography variant="body1">
                          {
                            getOldestAndLatestDates(stor.active_sprint_logs)
                              ?.latest?.story_point
                          }
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    );
  }

  function TabVelocityChart() {
    return (
      <Grid container>
        <Grid item md={6}>
          <Typography variant="h1">Velocity Chart</Typography>
        </Grid>
        <Grid item md={12}>
          {sprints.length > 0 && (
            <Bar
              data={{
                labels: sprints.map(s => s.sprint_name),
                datasets: [
                  {
                    label: "Commitment",
                    data: sprints.map((s) => s.plan_story_point),
                    backgroundColor: 'rgba(194, 194, 194, 0.5)',
                  },
                  {
                    label: "Completed",
                    data: sprints.map((s) => s.actual_story_point),
                    backgroundColor: 'rgba(6, 153, 90, 0.5)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  title: {
                    display: true,
                    text: "Velocity Chart Project " + selectedProject?.name,
                  },
                },
              }}
            />
          )}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container>
      <FormStoryDialog
        id={formStoryDialog.id}
        isOpen={formStoryDialog.isOpen}
        onClose={() => closeStoryDialog()}
        onSaved={() => fetchData()}
      />
      <Grid item md={12}>
        <BackofficeBreacrumbs links={crumbs} />
      </Grid>
      <Grid item md={6}>
        <Typography variant="h1">Report</Typography>
      </Grid>
      <Grid item md={12} container>
        <Box sx={{ width: "100%" }}>
          <TabContext value={tabIndex}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={(e, value) => setTabIndex(value)}>
                <Tab label="Sprint Report" value="0" />
                <Tab label="Velocity Chart" value="1" />
              </TabList>
            </Box>
            <TabPanel value="0">
              <TabVelocityChart />
            </TabPanel>
            <TabPanel value="1">
              <TabSprintReport />
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ReportSprint;
