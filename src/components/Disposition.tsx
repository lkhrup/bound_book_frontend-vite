import {useForm} from "react-hook-form";
import {useState} from "preact/hooks";
import {Link} from "react-router-dom";
import {FormField} from "./FormField.tsx";
import {Tabs} from "./Tabs.tsx";
import {uuidv7} from "uuidv7";

// TODO: The route should allow passing an acquisition ID and a transferee ID.
export default function Disposition() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: uuidv7(),
      date: new Date().toISOString().split("T")[0],
      acquisition: "",
      transferee_name: "",
      transferee_license_number: "",
      transferee_address: "",
    }
  });
  const [transfereeStatus, setTransfereeStatus] = useState<string>("licensed");
  const fieldProps = { register, errors };

  return (
    <>
      <Link to={`/`}>Home</Link>
      <form
        className="shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-gray-100"
        onSubmit={handleSubmit((data) => {
          // TODO: encrypt data with public key and post to server
          console.log(data);
        })}
      >
        <h1 className="text-2xl mb-3">Disposition</h1>
        <FormField label="Date" name="date" type="date" required {...fieldProps}/>

        <h2 className="text-xl mb-3">Firearm</h2>
        <p>TODO: this section allow the user to select a firearm from the inventory.</p>
        <p>A firearm in the inventory is one for which we have an acquisition record, but no disposition record.</p>
        <p>The disposition record references the acquisition record's UUID.</p>
        <p>Once a firearm is selected, the form should display the acquisition date and firearm's details.</p>

        <h2 className="text-xl mb-3">Transferee</h2>
        <Tabs
          tabs={[
            { key: "licensed", label: "Licensed" },
            { key: "non-licensed", label: "Non-Licensed" },
          ]}
          active={transfereeStatus}
          setActive={setTransfereeStatus}
        />
        <FormField label="Transferee Name" name="transferee_name" type="text" {...fieldProps} required/>
        {transfereeStatus === "licensed" && (
          <FormField label="Transferor License Number" name="transferee_license_number" type="text" {...fieldProps}
                     required/>
        )}
        {transfereeStatus === "non-licensed" && (
          <FormField label="Transferor Address" name="transferee_address" type="text" {...fieldProps} required/>
        )}
        <div className="flex justify-center">
          <input
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline drop-shadow"
            type="submit"
            value="Record Acquisition"
          />
        </div>
      </form>
      {Object.keys(errors).length > 0 && (
        <p>
          Please correct the errors in the form and try again.
        </p>
      )}
    </>
  );
}
