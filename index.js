import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [
    // starting post
    {
        title: "Grimace Birthday Shake",
        description: "The trend was created by TikToker @thefrazmaz, who released a video of himself tasting the Grimace Shake the day after it was introduced, cutting to a scene of him lying dead on the floor, his mouth stained with purple.",
        imageURL: "https://www.news-journalonline.com/gcdn/presto/2023/06/26/PNJM/e3011fa8-8b58-4689-8d6a-c2300294fd25-grimace.jpeg?width=1200&disable=upscale&format=pjpg&auto=webp",
        dateTime: "Dec 27, 2023, 2:53 AM",
        pathName: "Grimace-Birthday-Shake"
    },
    {
        title: "Dancing Toothless",
        description: "In the exploitable viral video Dancing Toothless, a 2D animated Toothless from How to Train Your Dragon is seen dancing to the tune \"Driftveil City\" from Pokémon: Black & White. The video is a collection of green screen edits. The animated snippet was taken from a video posted on YouTube by Cas van de Pol in December 2023. That same month, it was the focus of memes and video alterations on platforms like TikTok and YouTube. This dance is a parody of the Dancing Lizard trend from 2018.",
        imageURL: "https://media1.tenor.com/m/-9lHctoXbJkAAAAC/toothless-toothless-dragon.gif",
        dateTime: "Dec 27, 2023, 3:00 AM",
        pathName: "Dancing-Toothless"
    },
    {
        title: "Mouse Moment or Mouse Eating Alone",
        description: "The small mouse originates from the British stop-motion mockumentary series Creature Comforts, and the serene piano tune is a slowed version of \"New Home\" by Austin Farwell.",
        imageURL: "https://media1.tenor.com/m/2GBK8X7jSP8AAAAd/rat-eats-mm-rat.gif",
        dateTime: "Dec 28, 2023, 2:40 PM",
        pathName: "Mouse-Moment-Mouse-Eating-Alone"
    }
];

app.set("view engine", "ejs");

app.set("views", join(__dirname, "views"));

app.get("/", (req, res) => {
    const postsWithTruncatedDescription = posts.map(post => {
        const truncatedDescription = post.description.substring(0, 80) + "...";
        return { ...post, truncatedDescription };
    });

    res.render("index.ejs", { posts: postsWithTruncatedDescription });
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});



app.post("/submit", (req, res) => {
    const { title, description, imageURL } = req.body;
    const pathName = title.replace(/[^\w\s]/gi, "").replace(/\s+/g, "-").replace(/\//g, "-")    

    const currentDateTime = new Date();
    const options = { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" };
    const formattedDateTime = currentDateTime.toLocaleDateString("en-US", options);

    const newPost = {
        title,
        description,
        imageURL,
        dateTime: formattedDateTime,
        pathName
    };
    posts.push(newPost);
    // res.render("index.ejs", { posts }); maybe use res.send instead?
    res.render("post.ejs", { post: newPost});
    console.log(posts);
});

app.get("/:pathName", (req, res) => {
    const requestedTitle = req.params.pathName;
    const post = posts.find((post) => post.pathName === requestedTitle);
    if (post) {
      res.render("post.ejs", { post });
    } else {
      res.status(404).send("Post Not Found");
    }
}); 
//   make the title special char to be a dash instead
  
app.get("/:pathName/edit", (req, res) => {

    const pathName = req.params.pathName;
    const post = posts.find(post => post.pathName === pathName);
  
    if (post) {
      res.render("edit", { post });
    } else {
      res.status(404).send("Post not found");
    }
  });    

  app.post("/update/:pathName", (req, res) => {
    const pathName = req.params.pathName;
    const { title, description, imageURL, formAction } = req.body;

    if (formAction === "update") {
        const index = posts.findIndex(post => post.pathName === pathName);

        if (index !== -1) {
            const currentDateTime = new Date();
            const options = { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" };
            const formattedDateTime = currentDateTime.toLocaleDateString("en-US", options);
            
            // Directly modifying the properties of posts[index]
            posts[index].title = title;
            posts[index].description = description;
            posts[index].imageURL = imageURL;
            posts[index].dateTime = formattedDateTime;
        }
    } else if (formAction === "delete") {
        // Delete the post with the specified pathName
        const index = posts.findIndex(post => post.pathName === pathName);

        if (index !== -1) {
            // Remove the post from the array
            posts.splice(index, 1);
        }
    }

    // Redirect to the updated post or home page
    res.redirect("/");
});


app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`);
});