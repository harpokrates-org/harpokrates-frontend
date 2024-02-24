import UserSearcher from "@/app/(console)/photos/components/UserSearcher";
import { Grid } from "@mui/material";
import ImageGallery from "./components/ImageGallery";
import WasmTest from "./components/WasmTest";

export default function Photos() {
  return (
    <Grid container p={2} spacing={2}>
      <Grid item xs={12}>
        <UserSearcher />
      </Grid>
      <Grid item xs={12}>
        <ImageGallery />
        <WasmTest />
      </Grid>
    </Grid>
  );
}
