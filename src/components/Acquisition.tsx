import {useState} from "preact/hooks";
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {uuidv7} from "uuidv7";
import {Tabs} from "./ui/Tabs.tsx";
import {FormField} from "./ui/FormField.tsx";

export default function Acquisition() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: uuidv7(),
      date: new Date().toISOString().split("T")[0],
      type: "",
      model: "",
      caliber_or_gauge: "",
      manufacturer: "",
      country_of_manufacture: "",
      importer: "",
      serial_number: "",
      transferor_name: "",
      transferor_license_number: "",
      transferor_address: "",
    }
  });
  const [transferorStatus, setTransferorStatus] = useState<string>("licensed");
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
        <h1 className="text-2xl mb-3">Acquisition</h1>
        <FormField label="Date" name="date" type="date" required {...fieldProps}/>

        <h2 className="text-xl mb-3">Firearm</h2>
        {/* TODO: some form fields should auto-complete from a master table */}
        <FormField label="Type" name="type" type="text" required {...fieldProps}/>
        <FormField label="Model" name="model" type="text" required {...fieldProps}/>
        <FormField label="Caliber or Gauge" name="caliber_or_gauge" type="text" required {...fieldProps}/>
        <FormField label="Manufacturer" name="manufacturer" type="text" required {...fieldProps}/>
        <FormField label="Country of Manufacture" name="country_of_manufacture" type="text" required
                   {...fieldProps}/>
        <FormField label="Importer (if any)" name="importer" type="text" {...fieldProps}/>
        <FormField label="Serial Number" name="serial_number" type="text" required {...fieldProps}/>

        <h2 className="text-xl mb-3">Transferor</h2>
        <Tabs
          tabs={[
            { key: "licensed", label: "Licensed" },
            { key: "non-licensed", label: "Non-Licensed" },
          ]}
          active={transferorStatus}
          setActive={setTransferorStatus}
        />
        <FormField label="Transferor Name" name="transferor_name" type="text" {...fieldProps} required/>
        {transferorStatus === "licensed" && (
          <FormField label="Transferor License Number" name="transferor_license_number" type="text" {...fieldProps}
                     required/>
        )}
        {transferorStatus === "non-licensed" && (
          <FormField label="Transferor Address" name="transferor_address" type="text" {...fieldProps} required/>
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
