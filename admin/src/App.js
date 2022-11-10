import { AdminProvider } from "./AdminContext";
import Routing from "./Routing";

function App() {
  return (
    <>
      <AdminProvider>
        <Routing />
      </AdminProvider>
    </>
  );
}

export default App;
