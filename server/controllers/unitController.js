const unit = require("../models/unitModel");

const get_unit = async (req, res) => {
  try {
    const get_unit = await unit.get_unit();
    res.status(200).json({ data: get_unit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const add_unit = async (req, res) => {
  try {
    const data = req.body;
    const new_unit = await unit.add_unit(data);
    res.status(200).json({ data: new_unit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const edit_unit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const edit_unit = await unit.edit_unit(id, data);
    res.status(200).json({ data: edit_unit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const delete_unit = async (req, res) => {
  try {
    const id = req.params.id;
    const delete_unit = await unit.delete_unit(id);
    res.status(200).json({ data: delete_unit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  get_unit,
  add_unit,
  edit_unit,
  delete_unit,
};
