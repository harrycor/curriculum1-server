import React, { useState, useEffect } from "react";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import Select from "react-select";
import SendText from "./SendText";
import Moment from "moment";
import moment from "moment";

const wrestlersInterfaceSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  weight: z.number(),
  age: z.number(),
  WAR: z.number(),
  phone: z.number().optional(),
});

const FilterWrestlers = ({
  enableTextingFunctionality = false,
}: {
  enableTextingFunctionality?: boolean;
}) => {
  const [placeHolderWrestlers, setPlaceHolderWrestlers] = useState<
    wrestlersInterface[]
  >([]);
  const [wrestlers, setWrestlers] = useState<wrestlersInterface[]>([]);
  const [checkBoxState, setCheckBoxState] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [
    textCurrentlyViewedWrestlersEvenIfTheyDontWantTo,
    setTextCurrentlyViewedWrestlersEvenIfTheyDontWantTo,
  ] = useState<boolean>(false);

  // This function takes an object that matches the shape of the objects in the array
  // that are passed into it and applies the filter on each cooresponding key value
  function filterArray(array: wrestlersInterface[], filters: any) {
    const filterKeys = Object.keys(filters);
    return array.filter((item: any) => {
      // validates all filter criteria
      return filterKeys.every((key: string) => {
        // ignores non-function predicates
        if (typeof filters[key] !== "function") return true;
        return filters[key](item[key]);
      });
    });
  }

  let token = localStorage.getItem("token");
  let UID = localStorage.getItem("UID");

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        UID,
      }),
    };
    fetch("/api/warZone/initialGetAllWrestlers", requestOptions)
      .then((res: any) => res.json())
      .then((data: any) => {
        console.log({ warUser: data });
        setPlaceHolderWrestlers(data);
        setWrestlers(data);
      })
      .catch((err: any) => console.log(err));
  }, []);

  // Form Schemas
  const rangeFormSchema = z.object({
    WARrange: number(),
    WARrange2: number(),
    ageRange: number(),
    ageRange2: number(),
    weightRange: number().positive(),
    weightRange2: number().positive(),
  });

  const percentFormSchema = z.object({
    weight: number().positive(),
    WAR: number().positive(),
    age: number().positive(),
    selectedWrestler: wrestlersInterfaceSchema,
  });

  // Here lies our 1st form logic
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(rangeFormSchema),
  });
  const { errors }: any = formState;

  function onRangeFormSubmit(formData: unknown) {
    const isValid = rangeFormSchema.parse(formData);

    const filters = {
      age: (age: number) => age >= isValid.ageRange && age <= isValid.ageRange2,

      weight: (weight: number) =>
        weight >= isValid.weightRange && weight <= isValid.weightRange2,

      WAR: (WAR: number) => WAR >= isValid.WARrange && WAR <= isValid.WARrange2,
    };

    let newArray = filterArray(placeHolderWrestlers, filters);

    setWrestlers(newArray);
    // reset();
  }

  // Here lies our 2nd form logic
  const {
    register: register2,
    control: control2,
    handleSubmit: handleSubmit2,
    formState: formState2,
    reset: reset2,
  } = useForm({
    resolver: zodResolver(percentFormSchema),
  });
  const { errors: errors2 } = formState2;

  const { field } = useController({
    name: "selectedWrestler",
    control: control2,
  });

  const handleSelectChange = (option: any) => {
    field.onChange(option);
  };

  function onPercentFormSubmit(formData2: unknown) {
    const isValid = percentFormSchema.parse(formData2);

    let weightDifferential =
      isValid.selectedWrestler.weight * (isValid.weight / 100);

    const filter = {
      age: (age: number) =>
        isValid.selectedWrestler.age >= age - isValid.age &&
        isValid.selectedWrestler.age <= age + isValid.age,

      weight: (weight: number) =>
        Math.abs(weight - isValid.selectedWrestler.weight) <=
        weightDifferential,

      WAR: (WAR: number) =>
        isValid.selectedWrestler.WAR >= WAR - isValid.WAR &&
        isValid.selectedWrestler.WAR <= WAR + isValid.WAR,
    };

    let newArray = filterArray(placeHolderWrestlers, filter);

    setWrestlers(newArray);
    // reset();
  }

  // Check box stuff

  useEffect(() => {
    if (placeHolderWrestlers.length > 0) {
      const objectForCheckedState: any = {};

      placeHolderWrestlers.forEach((wrestler: any) => {
        objectForCheckedState[wrestler.id] = false;
      });

      setCheckBoxState(objectForCheckedState);
    }
  }, [placeHolderWrestlers]);

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = Number(e.currentTarget.name);

    setCheckBoxState((prevState) => {
      return {
        ...prevState,
        [name]: !prevState[name],
      };
    });
  };

  const [masterCheckedState, setMasterCheckedState] = useState<boolean>(false);

  const handleMasterCheckBoxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let isChecked = e.target.checked;

    type keyValueType = [number, boolean];
    let currentFilteredWrestlers: keyValueType[] = wrestlers.map((wrestler) => {
      if (
        wrestler.on_do_not_text_list == 1 &&
        textCurrentlyViewedWrestlersEvenIfTheyDontWantTo == false
      ) {
        return [wrestler.id, false];
      } else {
        return [wrestler.id, true];
      }
    });

    let objectOfOnlyShownWrestlers = Object.fromEntries([
      ...currentFilteredWrestlers,
    ]);

    function setAllObjectValuesToValue(
      object: { [key: number]: boolean },
      value: boolean
    ) {
      if (value == false) {
        Object.keys(object).forEach((key: any) => {
          object[key] = value;
        });
        return object;
      } else if (value == true) {
        return object;
      } else {
        alert("There was no value given for master checkbox change");
      }
    }

    if (isChecked == false) {
      let newCheckedState = setAllObjectValuesToValue(checkBoxState, false);
      newCheckedState ? setCheckBoxState(newCheckedState) : null;
    } else if (isChecked == true) {
      let newCheckedState = setAllObjectValuesToValue(
        objectOfOnlyShownWrestlers,
        true
      );
      newCheckedState ? setCheckBoxState(newCheckedState) : null;
    }

    setMasterCheckedState(!masterCheckedState);
  };

  // HTML
  return (
    <>
      <div className="row">
        <form
          style={{
            padding: "1rem 0",
          }}
          onSubmit={handleSubmit(onRangeFormSubmit)}
          className="col-12 col-md-10 d-flex flex-wrap mx-auto justify-content-center align-items-center"
        >
          <div className="form-group m-1 md-col-2">
            <label htmlFor="exampleWeights">Enter Weight Range</label>
            <input
              // name="weightRange"
              {...register("weightRange", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleWeights"
              placeholder="Minimum Weight"
            />
            <input
              // name="weightRange2"
              {...register("weightRange2", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleWeights2"
              placeholder="Maximum Weight"
            />
            <small id="weightHelp" className="form-text text-danger">
              {errors.weightRange?.message} {errors.weightRange2?.message}
            </small>
          </div>

          <div className="form-group m-1 md-col-2">
            <label htmlFor="exampleWAR">Enter WAR Range</label>
            <input
              {...register("WARrange", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleWAR"
              placeholder="Minimum WAR"
            />
            <input
              {...register("WARrange2", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleWAR2"
              placeholder="Maximum WAR"
            />
            <small id="WARhelp" className="form-text text-danger">
              {errors.WARrange?.message} {errors.WARrange2?.message}
            </small>
          </div>

          <div className="form-group m-1 md-col-2">
            <label htmlFor="exampleAge">Enter Age Range</label>
            <input
              {...register("ageRange", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleAge"
              placeholder="Minimum Age"
            />
            <input
              {...register("ageRange2", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleAge"
              placeholder="Maximum Age"
            />
            <small id="ageHelp" className="form-text text-danger">
              {errors.ageRange?.message} {errors.ageRange2?.message}
            </small>
          </div>

          <div className="col-12 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary col-12 col-md-5">
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="row">
        <form
          style={{ padding: "1rem 0" }}
          onSubmit={handleSubmit2(onPercentFormSubmit)}
          className="col-12 col-md-10 d-flex flex-wrap mx-auto justify-content-center align-items-center"
        >
          <div className="form-group m-1 md-col-2">
            <label htmlFor="exampleSelect">Choose Wresler</label>

            <Select
              value={field.value}
              options={wrestlers}
              getOptionLabel={(option) =>
                `${option.first_name} ${option.last_name}`
              }
              getOptionValue={(option) =>
                `${option.first_name} ${option.last_name}`
              }
              onChange={handleSelectChange}
            />

            <small id="weightHelp" className="form-text text-danger">
              {errors2.selectedWrestler?.message}
            </small>
          </div>
          <div className="form-group m-1 md-col-2">
            <label htmlFor="examplePercent">Plus or Minus (%lbs)</label>
            <input
              {...register2("weight", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="examplePercent"
              placeholder="% Of Weight"
            />
            <small id="weightHelp" className="form-text text-danger">
              {errors2.weight?.message}
            </small>
          </div>

          <div className="form-group m-1 md-col-2">
            <label htmlFor="exampleWARscore">Plus or Minus (WAR)</label>
            <input
              {...register2("WAR", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleWARscore"
              placeholder="WAR Score"
            />
            <small id="weightHelp" className="form-text text-danger">
              {errors2.WAR?.message}
            </small>
          </div>
          <div className="form-group m-1 md-col-2">
            <label htmlFor="exampleAges">Plus or Minus (Age)</label>
            <input
              {...register2("age", {
                setValueAs: (v: string) => (v == "" ? undefined : Number(v)),
              })}
              type="number"
              className="form-control"
              id="exampleAges"
              placeholder="Age"
            />
            <small id="weightHelp" className="form-text text-danger">
              {errors2.age?.message}
            </small>
          </div>

          <div className="col-12 d-flex justify-content-center">
            <button type="submit" className="btn btn-secondary col-12 col-md-5">
              Submit
            </button>
          </div>
        </form>
      </div>

      {enableTextingFunctionality && (
        <SendText
          textUnwantedStateAndSetter={[
            textCurrentlyViewedWrestlersEvenIfTheyDontWantTo,
            setTextCurrentlyViewedWrestlersEvenIfTheyDontWantTo,
          ]}
          idsForText={checkBoxState}
        />
      )}

      <div className="table-responsive-md">
        <table className="table table-striped text-table">
          <thead
            style={{ position: "sticky", top: 0, backgroundColor: "white" }}
          >
            <tr>
              <th scope="col" className="col-1">
                #
              </th>
              <th scope="col" className="col-3">
                Name
              </th>
              <th scope="col">Last Weigh in</th>
              <th scope="col" className="col-1">
                Weight
              </th>
              <th scope="col" className="col-1">
                Age
              </th>
              <th scope="col" className="col-1">
                WAR
              </th>
              <th scope="col" className="col-1">
                Phone
              </th>
              {enableTextingFunctionality && (
                <th>
                  Text{" "}
                  <input
                    type="checkbox"
                    onChange={handleMasterCheckBoxChange}
                    checked={masterCheckedState}
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {wrestlers.map((wrestler, index) => {
              let date = new Date(wrestler.lastWeighInDate);
              return (
                <tr
                  key={`${index} ${wrestler.first_name} ${wrestler.WAR} ${wrestler.age} ${wrestler.weight}`}
                >
                  <th scope="row">{index + 1}</th>
                  <td>
                    {wrestler.first_name} {wrestler.last_name}
                  </td>
                  <td>
                    {Number.isNaN(date.valueOf()) == false
                      ? moment(date).fromNow()
                      : "No date sorry"}
                  </td>
                  <td>{wrestler.weight}</td>
                  <td>{wrestler.age}</td>
                  <td>{wrestler.WAR}</td>
                  <td>{wrestler.phone_number}</td>
                  {enableTextingFunctionality && (
                    <td>
                      <input
                        type="checkbox"
                        disabled={
                          wrestler.on_do_not_text_list === 1 &&
                          textCurrentlyViewedWrestlersEvenIfTheyDontWantTo ==
                            false
                        }
                        name={`${wrestler.id}`}
                        onChange={handleCheckBoxChange}
                        checked={checkBoxState[Number(wrestler.id)]}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FilterWrestlers;

interface wrestlersInterface {
  first_name: string;
  last_name: string;
  weight: number;
  on_do_not_text_list: 1 | 0;
  age: number;
  WAR?: number;
  id: number;
  phone_number: number;
  lastWeighInDate: string;
}
