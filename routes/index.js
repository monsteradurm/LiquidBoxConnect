export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.
    app.get('/', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    app.get('/folderItems', addon.authenticate(), (req, res) => {
      console.log("REQUEST?");
      res.json({message: "HERE", query: req})
    });

    app.get('/box', addon.authenticate(), (req, res) => {
        res.render(
          'box.jsx', // change this to 'hello-world.jsx' to use the Atlaskit & React version
          {
            title: req.query.title,
            spaceId: req.query.spaceId,
            spaceKey: req.query.spaceKey
          }
        );
    });

    // Add additional route handlers here...
}
