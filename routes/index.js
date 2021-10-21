export default function routes(app, addon) {
    // Redirect root path to /atlassian-connect.json,
    // which will be served by atlassian-connect-express.

    app.get('/LiquidBoxConnector', (req, res) => {
        res.redirect('/atlassian-connect.json');
    });

    app.get('LiquidBoxConnector/box', addon.authenticate(), (req, res) => {
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
