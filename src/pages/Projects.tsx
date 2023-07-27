import FormProjectDialog from '@/components/dialogs/FormProjectDialog'
import BackofficeTopNavigation from '@/components/global/BackofficeTopNavigation'
import { Pagination, Project } from '@/models'
import { fetchPaginateProjects } from '@/services/ProjectService'
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  debounce
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import dayjs from 'dayjs'
import ProjectDialog from '@/components/dialogs/ProjectDialog'
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from '@/store/hooks'
import { selectProject } from '@/store/slices/navbarSlice'
import { useNavigate } from 'react-router-dom'

const tableHeads = [
  'Nama', 'Key', 'Dibuat oleh', 'Aksi'
];

const Projects: React.FC = () => {
  const [tableData, setTableData] = useState<Pagination<Project> | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function onReady() {
    var tableData = await fetchPaginateProjects();
    setTableData(tableData);
  }

  async function fetchData() {
    var tableData = await fetchPaginateProjects(page, rowsPerPage, search);
    setTableData(tableData);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setSearch(e.target.value)
  }

  function chooseProject(val: Project) {
    dispatch(selectProject(val))
    navigate('/backlog')
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage])

  return (
    <Box sx={{ display: "flex" }}>
      <ProjectDialog
        isOpen={isDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false)
          onReady()
        }}
      />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white'
        }}
      >
        <BackofficeTopNavigation />
      </AppBar>
      <Grid container mt={10} px={4}>
        <Grid container item md={12} justifyContent="space-between">
          <Grid item md={2}>
            <Typography variant='h1'>Projects</Typography>
          </Grid>
          <Grid item md={2} container justifyContent='flex-end'>
            <Button variant='contained' onClick={() => setIsDialogOpen(true)}>
              Buat project
            </Button>
          </Grid>
        </Grid>
        <Grid item md={2}>
          <TextField
            value={search}
            onChange={handleSearch}
            onKeyDown={(e) => e.key == 'Enter' && fetchData()}
            label="Pencarian"
            size='small'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item container md={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeads.map((value, index) => (
                    <TableCell key={index}> {value} </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {tableData ? (
                <>
                  <TableBody>
                    {tableData.content.map((val, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Button variant='text' onClick={() => chooseProject(val)}>
                            {val.name}
                          </Button>
                        </TableCell>
                        <TableCell>
                          {val.key}
                        </TableCell>
                        <TableCell>
                          {dayjs(val.created_at).format('DD-MM-YYYY HH:mm')}
                        </TableCell>
                        <TableCell>
                          <IconButton>
                            <MoreHorizIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell>Belum ada data</TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {tableData && (
              <TablePagination
                component="div"
                rowsPerPageOptions={[10, 20, 30]}
                page={page}
                count={tableData.totalElements}
                rowsPerPage={rowsPerPage}
                onPageChange={(e, page) => setPage(page)}
                onRowsPerPageChange={(e) => {
                  setPage(0);
                  setRowsPerPage(parseInt(e.target.value))
                }}
              />
            ) }
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Projects