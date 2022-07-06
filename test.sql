\c nc_games_test

 `
        SELECT reviews.* COUNT(comment_id) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1;
        
        `