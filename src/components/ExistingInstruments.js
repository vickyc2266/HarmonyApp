import * as React from "react";

import {
  Box,
  Checkbox,
  Select,
  ListItemText,
  FormControl,
  MenuItem,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

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
  sx = {},
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
    <Box sx={sx}>
      <FormControl sx={{ margin: "auto", width: "100%" }}>
        <InputLabel id="ExistingInstruments">
          or you can choose from Harmony's database of questionnaires
        </InputLabel>
        <Select
          labelId="ExistingInstruments"
          id="multiple-checkbox"
          multiple
          value={instrumentNames.filter((i) => {
            return allInstrumentNames.includes(i);
          })}
          onChange={handleChange}
          input={<OutlinedInput label="or you can choose from Harmony's database of questionnaires" />}
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
    </Box>
  );
}
