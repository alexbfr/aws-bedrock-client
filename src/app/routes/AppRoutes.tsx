import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChooseModel } from "../components/ChooseModel.tsx";
import { ChatWithModelRouteTarget } from "./ChatWithModelRouteTarget.tsx";
import { ChatRouteTarget } from "./ChatRouteTarget.tsx";

export function makeModelRoute(modelId: string) {
  return `/chat/${modelId}`;
}

export function makeChatRoute(modelId: string, chatId: string) {
  return `/chat/${modelId}/${chatId}`;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChooseModel />} />
        <Route path="/chat/:modelId" element={<ChatWithModelRouteTarget />}>
          <Route path=":chatId" element={<ChatRouteTarget />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
