const res = require("express/lib/response");
const { Comment, Pizza } = require("../models");

const commentController = {
  // add comment to pizza
  // need to add the pizza id in the url params
  addComment({ params, body }, res) {
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          // adds the comment's _id to the specific pizza we want to update.
          // $push method works similar to js as it adds to an array
          // All mongoDB functions start with a $.
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: "No comment found with this id!" })
        return
      }
      res.json(dbPizzaData)
    })
    .catch(err => res.json(err))
  },

  // remove comment
  // We need to not only delete the comment but remove it from the pizza it is associated with.
  removeComment({ params }, res) {
    // deletes the document and also returns its data
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        return Pizza.findOneAndUpdate(
          // this gets the pizza Id from url params in order to update the comment section
          { _id: params.pizzaId },
          // we use pull this time another mongoDB function to remove the deleted comment
          { $pull: { comments: params.commentId } },
          // so we can return the updated document
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
    .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => res.json(err))
  }
};

module.exports = commentController;
