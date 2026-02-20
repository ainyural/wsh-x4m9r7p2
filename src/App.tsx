import { ChatScreen } from "./components/ChatScreen";
import { chatPrototype } from "./data/chatPrototype";

export default function App() {
  return <ChatScreen model={chatPrototype} />;
}
