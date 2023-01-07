import Note from "../models/Note.js";

export const handleGetNotes = async (req, res) =>{
    try {
        const note = await Note.findOne({owner: req.params.id});
        // if(!note){return res.status(400).json({message: 'couldnt fetch notifications', clientMessage: 'не удается загрузить уведомдления'})}
        if(!note){const newNote = new Note({owner: req.params.id, notes: [{
            text: 'Поздравляем с регистрацией на нашем сайте! При возникновении проблем, вы можете обратиться в поддержку по общему телефону или в live-чате в разделе "Помощь"',
            date: Date.now(),
            isRecent: true,
            deleted: false,
            like: false
        }
        ]});
        await newNote.save();
        };
        return res.json(note);
    } catch (error) {
        res.status(500).json({message: 'server side error during get settings data', clientMessage: 'Не удается загрузить уведомдления'});
    }
} 

export const handleSendNote = async (req, res) => {
    try {
        const {text} = req.body;
        const id = req.params.id
        const note = await Note.findOne({owner: id});
        console.log(`found: ${note}, user id: ${id}, text: ${text}`)

        note.notes.push({text, date: Date.now(), isRecent: true, deleted: false, like: false});
        await note.save();

        res.json({message: "notification pushed successfuly"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "server side error"})
    }
} 

export const handleLikeNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        const target = req.params.target;


        const targetIndex =  note.notes.findIndex(item=> item._id == target);
        note.notes[targetIndex].like = !note.notes[targetIndex].like;

        await note.save();
        res.sendStatus(200);
    } catch (error) {
        console.error(error)
    }
};

export const handleRecentNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        const target = req.params.target;
 

        const targetIndex = note.notes.findIndex(item => item._id == target);
        note.notes[targetIndex].isRecent = false;
        await note.save();
        res.sendStatus(200);
    } catch (error) {
        console.error(error)
    }
};

export const handleDeleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        const target = req.params.target;
        
        const targetIndex =  note.notes.findIndex(item=> item._id == target);
        note.notes[targetIndex].deleted = true;
        await note.save();
        res.status(200).json({message: 'deleted', clientMessage: 'Уведомление удалено'});
    } catch (error) {
        console.error(error)
    }
}