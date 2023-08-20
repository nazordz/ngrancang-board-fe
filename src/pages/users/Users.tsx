import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Pagination, User } from "@/models";
import { deleteUserById, fetchPaginateUsers, updateStatusUser } from "@/services/UserService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import SearchIcon from "@mui/icons-material/Search";
import { showSnackbar } from "@/store/slices/snackbarSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FormUserDialog from "@/components/dialogs/FormUserDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

const Users: React.FC = () => {
  const [tableData, setTableData] = useState<Pagination<User> | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUserid, setSelectedUserid] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  async function fetchData() {
    const paginateUsers = await fetchPaginateUsers(page, rowsPerPage, search);
    setTableData(paginateUsers);
  }

  function handleSearch(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSearch(e.target.value);
  }

  async function changeUserStatus(userId: string, newStatus: boolean) {
    const newUser = await updateStatusUser(userId, newStatus);
    if (newUser) {
      await fetchData();
      dispatch(
        showSnackbar({
          isOpen: true,
          message: "Status berhasil diubah",
          variant: "success",
        })
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  function closeDialog() {
    setShowUserDialog(false)
    setSelectedUserid('')
    fetchData()
  }

  function onEditUser(id: string): void {
    setSelectedUserid(id);
    setShowUserDialog(true);
  }

  function onDeleteUser(id: string) {
    setShowConfirmDialog(true)
    setSelectedUserid(id)
  }

  async function confirmDelete() {
    await deleteUserById(selectedUserid)
    setShowConfirmDialog(false)
    setSelectedUserid("")
    fetchData()
  }

  return (
    <Grid container>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Anda yakin untuk menghapus user ini?"
        message="User akan dihapus"
        onConfirm={() => confirmDelete()}
        onCancel={() => setShowConfirmDialog(false)}
      />
      <FormUserDialog
        isOpen={showUserDialog}
        onClose={() => setShowUserDialog(false)}
        onSaved={() => closeDialog()}
        id={selectedUserid}
      />
      <Grid item md={9}>
        <Typography variant="h1">User Management</Typography>
      </Grid>
      <Grid item md={3} container justifyContent="space-around">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowUserDialog(true)}
        >
          Buat User
        </Button>
        <TextField
          value={search}
          onChange={handleSearch}
          onKeyDown={(e) => e.key == "Enter" && fetchData()}
          label="Pencarian"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item md={12} sm={12}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>No. Telp</TableCell>
                <TableCell>Posisi</TableCell>
                <TableCell>Aktif</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            {tableData ? (
              <TableBody>
                {tableData.content.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.is_active}
                        value={user.is_active}
                        onChange={(event) => {
                          let currentStatus = event.target.value == "true";
                          changeUserStatus(user.id, !currentStatus);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton color="info" onClick={() => onEditUser(user.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => onDeleteUser(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Belum ada data
                  </TableCell>
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
                setRowsPerPage(parseInt(e.target.value));
              }}
            />
          )}
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Users;
