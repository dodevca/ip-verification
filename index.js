const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const data = fs.readFileSync('./db/IP.json');
    let json = JSON.parse(data);
    let owner = 'tioo'
    const app = express();
    app.set("json spaces", 2);
    const port = 3000;

    app.get("/ip", async (req, res) => {
   let { key } = req.query;
    if (!key) return res.json({
                msg: 'lu siapa'
            })
            if (key !== owner) return res.json({
                msg: 'ngentot lu'
            })
        try {
            
            if (json.length == 0) {
                return res.json({
                    msg: 'daftar ip kosong'
                })
            }
            res.json({
                ip: json
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                error: error
            });
        }
    });

    app.get('/myip', (req, res) => {
    try {
  const ip = req.headers['x-forwarded-for']

  res.json({ ip: ip});
  } catch (e) {
  res.json('error')
  }
});

    app.post("/acc", async (req, res) => {
        try {
            let ip = req.query.text;
            let own = req.query.key
                        
            if (!ip) return res.json({
                msg: 'masukan ip nya'
            })
            if (!own) return res.json({
                msg: 'masukan key Owner'
            })
            if (own !== owner) return res.json({
                msg: 'key salah'
            })
            
            if (json.includes(ip)) return res.json({
                msg: 'Ip sudah tersedia'
            });
            json.push(ip);
            fs.writeFileSync('./db/IP.json', JSON.stringify(json));
            res.json({
                msg: 'sukses acc ip ' + ip
            });
        } catch (e) {
            res.status(500).json({
                error: e
            });
        }
    })

    app.post("/delacc", async (req, res) => {
        try {
            let ip = req.query.text;
            let own = req.query.key
            if (!ip) return res.json({
                msg: 'masukan ip nya'
            })
            if (!own) return res.json({
                msg: 'masukan key Owner'
            })
            if (own !== owner) return res.json({
                msg: 'key salah'
            })
            
            if (!json.includes(ip)) return res.json({
                msg: 'Ip tidak tersedia'
            });
            json.splice(json.indexOf(ip), 1);
            fs.writeFileSync('./db/IP.json', JSON.stringify(json));
            res.json({
                msg: 'sukses delete acc ip ' + ip
            });
        } catch (e) {
            res.status(500).json({
                error: e
            });
        }
    })

    app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/db/index.html')
})

    app.listen(port, () => {
        console.log(`\n\nServer api running on http://localhost:${port}\n\n`);
    });
    
