import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            My Frontend 1.0
          </Typography>
          <Button color="inherit" onClick={() => navigate("/item")}>
            Item
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Outlet />
      </Box>
    </div>
  );
}
