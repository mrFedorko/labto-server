import Review from "../models/Review.js";
import User from "../models/User.js"

export const handleGetAllReviews = async (req, res) =>{
    try {
        const reviews = await Review.find({access: true});
        if(!reviews || reviews === []){return res.status(404).json({message: "no reviews", clientMessage: "отзывов пока-что нет"})};
        return res.json(reviews);
    } catch (error) {
        res.status(500).json({message: 'server side error during get review data', clientMessage: 'Не удается загрузить отзывы'});
    }
} 

export const handleGetMyReviews = async (req, res) =>{
    try {
        const reviews = await Review.find({owner: req.params.id});
        if(!reviews){return res.status(404).json({message: "no reviews", clientMessage: "Похоже, вы не написали ни одного отзыва"})};
        return res.json(reviews);
    } catch (error) {
        res.status(500).json({message: 'server side error during get review data', clientMessage: 'Не удается загрузить ваши отзывы'});
    }
}  

export const handleSendReview = async (req, res) => {
    try {
        const {text, rate, date, order, img, anonim} = req.body;
        const id = req.params.id
        const author = await User.findById(id)
        const name = author.settings.name
   
        
        const newReview = new Review({text, rate, date, order, img, anonim, owner: id, name, access: false});

        await newReview.save();

        res.json({message: "success", clientMessage: "Отзыв успешно отправлен"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "server side error"})
    }
} 

export const handleChangeReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.target);
        const owner = review.owner.valueOf()
        if(owner !== req.params.id){
            return res.sendStatus(403)
        }
        const {text, rate, date, order, img, anonim} = req.body;
        review.text = text;
        review.rate = rate;
        review.date = date;
        review.order = order;
        review.img = img;
        review.anonim = anonim;
        review.access = false;

        await review.save();
        res.sendStatus(200);
    } catch (error) {
        console.error(error)
    }
};

export const handleGetReviewById = async (req, res) => {
    try {
        const review = await Note.findById(req.params.target);
        if(review.owner.valueOf() !== req.params.id){
            return res.sendStatus(403)
        }
 
        res.status(200).json(review)
    } catch (error) {
        console.error(error)
    }
};

export const handleDeleteReview = async (req, res) => {
    try {
        const target = Review.findOne({_id: req.params.target, owner: req.params.id})
        if (!target){return res.sendStatus(403)}
        await Review.deleteOne({_id: req.params.target, owner: req.params.id})
    } catch (error) {
        console.error(error)
    }
}

