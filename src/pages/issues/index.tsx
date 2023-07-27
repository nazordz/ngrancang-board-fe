import BackofficeBreacrumbs, { LinkBreadcrumb } from '@/components/global/BackofficeBreacrumbs';
import { useAppSelector } from '@/store/hooks';
import { Box, Grid, Table, TableCell, TableContainer, TableHead, Typography } from '@mui/material'
import React from 'react'

const Issue: React.FC = () => {
  const [crumbs, setCrumbs] = React.useState<LinkBreadcrumb[]>([]);
  const selectedProject = useAppSelector(
    (state) => state.navbarSlice.selectedProject
  );
  React.useEffect(() => {
    setCrumbs([
      {
        title: "Projects",
        link: "/projects",
      },
      {
        title: selectedProject!.name,
        link: "/sprints",
      },
    ]);
  }, []);
  return (
    <Grid container>
      <Grid item md={12}>
        <BackofficeBreacrumbs links={crumbs} />
      </Grid>
      <Grid item md={12}>
        <Typography variant="h1">Issues</Typography>
      </Grid>
      <Grid container item md={12}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell>

              </TableCell>
            </TableHead>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default Issue;
