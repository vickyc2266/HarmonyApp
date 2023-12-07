import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

export default function ExistingInstruments({
  existingReceiver,
  existingInstruments,
  fileInfos,
}) {
  const allInstrumentNames = existingInstruments.map((i) => i.instrument_name);
  const instrumentNames = fileInfos.map((i) => i.instrument_name);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    existingReceiver(value);
  };

  return (
    <div>
      <FormControl sx={{ mt: 2, width: "100%" }}>
        <InputLabel id="ExistingInstruments">
          Choose from existing instruments:
        </InputLabel>
        <Select
          labelId="ExistingInstruments"
          id="multiple-checkbox"
          multiple
          value={instrumentNames.filter((i) => {
            return allInstrumentNames.includes(i);
          })}
          onChange={handleChange}
          input={<OutlinedInput label="Choose from existing instruments" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {allInstrumentNames.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={instrumentNames.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
