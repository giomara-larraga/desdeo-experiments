import { useEffect, useState, useCallback } from "react";
import {
  ProblemInfo,
  ObjectiveData,
  ObjectiveDatum,
} from "../../types/ProblemTypes";
import HorizontalBars from "../../components/HorizontalBars";
import { Tokens } from "../../types/AppTypes";

import { Link } from "react-router-dom";
import { ParseSolutions, ToTrueValues } from "../../utils/DataHandling";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ParallelAxes } from "desdeo-components";
import SolutionTable from "../../components/SolutionTable";
import SolutionTableMultiSelect from "../../components/SolutionTableMultiSelect";
import ClassificationsInputForm from "../../components/ClassificationsInputForm";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { CardContent } from "@material-ui/core";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import { NimbusMethodProps, NimbusState, Classification } from "./nimbusTypes";
import { Col, Form, Row, Table } from "react-bootstrap";
import { createMethod, fetchProblemInfo } from "./nimbusHelpers";
import { useReadMOP } from "./useReadMOP";
import SolutionTableMUI from "../../components/SolutionTableMUI";
const drawerWidth = 550;

function NimbusMethod({
  isLoggedIn,
  loggedAs,
  tokens,
  apiUrl,
  problemGroup,
}: //activeProblemId,
NimbusMethodProps) {
  // 1. create the method
  const [activeProblemInfo, SetActiveProblemInfo] = useState<ProblemInfo>();

  const handleReadMOP = async () => {
    const problem_info = await fetchProblemInfo(apiUrl, tokens, problemGroup);
    if (problem_info) {
      SetActiveProblemInfo(problem_info);
    }
  };

  // 2. Fetch problem info

  useEffect(() => {
    console.log("trying to read");
    createMethod(apiUrl, tokens, problemGroup, "synchronous_nimbus");
    handleReadMOP();

    // This code will run once when the component is mounted
  }, []);

  const [archivedSolutions, SetArchivedSolutions] = useState<ObjectiveData>();
  const [selectedIndices, SetSelectedIndices] = useState<number[]>([]);
  const [selectedIndexArchive, SetSelectedIndexArchive] = useState<number>(-1);
  const [preferredPoint, SetPreferredPoint] = useState<number[]>([]);
  const [classifications, SetClassifications] = useState<Classification[]>([]);
  const [classificationLevels, SetClassificationLevels] = useState<number[]>(
    []
  );

  //SetClassifications(activeProblemInfo!.objectiveNames.map(() => "="));
  //SetClassificationLevels(activeProblemInfo!.objectiveNames.map(() => 0.0));

  // 3. Start the method

  // 4. Iterate handler

  // 5. Archive handler

  // 6. Stop handler

  // 7. Infer clasifications

  return (
    <Box sx={{ display: "flex", width: "-webkit-fill-available" }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          sx={{
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
          PaperProps={{ elevation: 9 }}
        >
          <Toolbar />
          <Container sx={{ padding: "2.3rem", paddingTop: "1rem" }}>
            <Typography sx={{ fontWeight: "bold", m: 1 }}>
              Classification
              {activeProblemInfo?.objectiveNames}
            </Typography>
            {activeProblemInfo !== undefined && (
              <div>
                test
                {/*                 <HorizontalBars
                  objectiveData={ToTrueValues(
                    ParseSolutions([preferredPoint], activeProblemInfo)
                  )}
                  referencePoint={classificationLevels.map((v, i) =>
                    activeProblemInfo!.minimize[i] === 1 ? v : -v
                  )}
                  currentPoint={preferredPoint.map((v, i) =>
                    activeProblemInfo!.minimize[i] === 1 ? v : -v
                  )}
                  //setReferencePoint={inferClassifications} // the reference point is passed in its true form to the callback
                  dimensionsMaybe={{
                    chartHeight: 400,
                    chartWidth: 800,
                    marginLeft: 0,
                    marginRight: 150,
                    marginTop: 0,
                    marginBottom: 30,
                  }}
                /> */}
              </div>
            )}
          </Container>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
        }}
      >
        <Toolbar />
        <Container>
          <Card variant="outlined" sx={{ marginBottom: "1rem" }}>
            <CardContent>
              <Typography color={"primary"} sx={{ fontWeight: "bold" }}>
                Parallel coordinate plot
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent>
              <Typography color={"primary"} sx={{ fontWeight: "bold" }}>
                Solution table
              </Typography>
              <SolutionTableMUI />
            </CardContent>
          </Card>
          <Box
            position="absolute"
            bottom="0px"
            display={"flex"}
            justifyContent={"right"}
            width={"-webkit-fill-available"}
            paddingRight={"50px"}
          >
            <Button variant="contained" sx={{ mt: 3, mb: 2, mr: 2 }}>
              Iterate
            </Button>
            <Button variant="contained" sx={{ mt: 3, mb: 2 }}>
              Stop
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default NimbusMethod;
