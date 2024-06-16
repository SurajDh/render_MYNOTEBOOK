const express = require('express');
const routers = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//Getting all the notes , GET : "api/notes/fetchallnotes" , Login required
routers.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//Adding a new note , GET : "api/notes/addnote" , Login required
routers.post('/addnote', fetchuser, [
    body('title', "enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const saveNote = await note.save();
        res.send(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});


//Update an existing note , PUT : "api/notes/updatenote" , Login required
routers.put('/updatenote/:id', fetchuser, [
    body('title', "enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {

    const { title, description, tag } = req.body;

    //create new node object
    try {
        const newNote = {};

        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //find note to update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //authenticate if note belongs to same user that is logged in
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access Denied")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

//DEletiong an existing note , DELETE : "api/notes/deletenote" , Login required
routers.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //find note to delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //authenticate if note belongs to same user that is logged in
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access Denied")
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

module.exports = routers;