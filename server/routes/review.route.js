import { Router } from 'express';
import { handleChangeReview, handleGetMyReviews, handleGetReviewById, handleSendReview } from '../controllers/reviewController.js';

const reviewRouter = Router();

reviewRouter.post(
    '/change/:id/:target/',
   handleChangeReview
);



reviewRouter.get(
    '/getMy/:id/',
    handleGetMyReviews
)

reviewRouter.get(
    '/getOne/:id/:target/',
    handleGetReviewById
)

reviewRouter.post(
    '/sendReview/:id/',
    handleSendReview
)

export {reviewRouter}