import { useState } from "react";
import EtherealStudio from "./EtherealStudio";
import EtherealBot from "./EtherealBot";

export default function App() {
  const [botOpen, setBotOpen] = useState(false);

  return (
    <>
      <EtherealStudio onOpenBot={() => setBotOpen(true)} />
      <EtherealBot forceOpen={botOpen} onClose={() => setBotOpen(false)} />
    </>
  );
}
