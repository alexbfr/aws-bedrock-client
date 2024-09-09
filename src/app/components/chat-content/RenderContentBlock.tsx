import {ContentBlock} from "@aws-sdk/client-bedrock-runtime";
import {Markdown} from "./Markdown.tsx";
import {ImageOutlined, QuestionMarkOutlined} from "@mui/icons-material";

export function RenderContentBlock({cb}: { cb: ContentBlock }) {

  if (cb.text) {
    return <Markdown text={cb.text}/>
  } else if (cb.image) {
    return <ImageOutlined/>
  } else {
    return <QuestionMarkOutlined/>;
  }
}