import "./App.css";
import { InitFoundationModels } from "../aws-integration/components/InitFoundationModels.tsx";
import { Suspense } from "react";
import { Loading } from "./components/Loading.tsx";
import {AppRoutes} from "./routes/AppRoutes.tsx";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <InitFoundationModels>
        <AppRoutes />
      </InitFoundationModels>
    </Suspense>
  );
}

export default App;
