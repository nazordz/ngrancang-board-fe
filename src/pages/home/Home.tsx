import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import scrumImg from "@/assets/images/scrum-home.png"
import "@/assets/styles/Home.scss"

function Home() {
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        sx={{
          background: 'linear-gradient(90.17deg, #4A69BD 0.62%, rgba(0, 88, 169, 0.55) 99.83%)',
          minHeight: 700
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item lg={4} px={2}>
            <Typography variant="h1" fontSize={48} color="white">
              Software Development
            </Typography>
            <Typography variant="h1" fontSize={48} color="white">
              Kanban Board
            </Typography>
            <Typography variant="h1" fontSize={48} color="white">
              #1 di Indonesia
            </Typography>
          </Grid>
          <Grid item lg={4} px={2}>
            <img alt="scrum" src={scrumImg} className="scrum-img" />
          </Grid>
        </Grid>
      </Box>
      <Container maxWidth="lg" sx={{display:'flex', justifyContent: "center", mt: 4}}>
        <Stack spacing={2}>
          <Typography
            variant="h1"
            color="secondary"
            align="center"
          >
            Solusi Masalah
          </Typography>
          <Typography variant="h2" className="font-dark">
            Kemudahan untuk menata pekerjaan anda di aplikasi Ngerancang tanpa ribet
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Home
