
async function getUserProjects (req, res) {
    try {
        return res.send('works')
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
}

module.exports = getUserProjects