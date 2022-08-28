/**
 *
 * @author Rico van Zelst <ricoz@tuta.io>
 * @description A twitter bot that tweets a random image every hour
 */

var fs = require("fs"),
  path = require("path"),
  Twit = require("twit"),
  config = require(path.join(__dirname, "config.js"));

var T = new Twit(config);

/**
 * @param  {} arr
 * @returns random element from array
 * @description returns random element from array
 */
function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function tweetRandomImage() {
  fs.readdir(__dirname + "/images", function (err, files) {
    if (err) {
      console.log("error:", err);
      return;
    } else {
      let images = [];
      /**
       * @returns adds all images to array
       * @description adds all images to array
       * @param  {} f
       */
      files.forEach(function (f) {
        images.push(f);
      });
      console.log("Selecting a random image...");

      const imagePath = path.join(
          __dirname,
          "/images/" + randomFromArray(images)
        ),
        imageData = fs.readFileSync(imagePath, {
          encoding: "base64",
        });

      console.log("Uploading: ", imagePath);

      T.post(
        "media/upload",
        {
          media_data: imageData,
        },
        /**
         * @param  {} err
         * @param  {} data
         * @param  {} response
         * @description uploads image to twitter
         * @returns tweet
         */
        function (err, data, response) {
          if (err) {
            console.log("error:", err);
          } else {
            const image = data;
            console.log("Image uploaded succesfully.");

            T.post(
              "media/metadata/create",
              {
                media_id: image.media_id_string,
                alt_text: {
                  text: "Randomized Image that got Posted by a bot",
                },
              },
              function (err, data, response) {
                var statusArray = [
                  "Caption 1",
                  "Caption 2",
                  "Caption 3",
                  "Caption 4",
                  "Caption 5",
                  "Caption 6",
                  "Caption 7",
                  "Caption 8",
                  "Caption 9",
                  "Caption 10",
                ];

                T.post(
                  "statuses/update",
                  {
                    status: `${randomFromArray(statusArray)}`,
                    media_ids: [image.media_id_string],
                  },
                  function (err, data, response) {
                    if (err) {
                      console.log("error:", err);
                    } else {
                      console.log("Successfully tweeted!");
                    }
                  }
                );
              }
            );
          }
        }
      );
    }
  });
}
/**
 * @param  {} function(
 * @description runs tweetRandomImage function every hour
 */
setInterval(function () {
  tweetRandomImage();
}, 3600000);
