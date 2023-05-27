import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { jsonToInterface } from "./functions/jsonToInterface";

const Person = {
  name: "John Doe",
  age: 30,
  cars: [
    { name: "Ford", models: ["Fiesta", "Focus", "Mustang"] },
    { name: "BMW", models: ["320", "X3", "X5"] },
    { name: "Fiat", models: ["500", "Panda"] },
  ],
};

const App = () => {
  const [json, setJson] = useState<string>(JSON.stringify(Person, null, 2));
  const [tsInterface, setTsInterface] = useState<string>(
    "// \ninterface Car {\n  name: string;\n  models: string[];\n}\n\ninterface InterfaceObject {\n  name: string;\n  age: number;\n  cars: Car[]\n}\n"
  );

  const jsonStringify = (json: string) => {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    setTsInterface(jsonToInterface(json));
  }, [json]);

  return (
    <div className="grid grid-cols-4 gap-3 bg-gray-900">
      <Editor
        height={"100vh"}
        width={"100%"}
        defaultLanguage="json"
        theme="vs-dark"
        defaultValue=""
        onChange={(e) => jsonStringify(e as string)}
        value={json}
      />

      <div className="col-span-3">
        <Editor
          height={"100vh"}
          width={"100%"}
          defaultLanguage="typescript"
          theme="vs-dark"
          value={tsInterface}
          defaultValue=""
          // onChange={(e) => e && setJson(jsonParse(e))}
        />
      </div>
    </div>
  );
};

export default App;
