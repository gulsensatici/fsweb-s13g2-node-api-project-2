// posts için gerekli routerları buraya yazın
const router = require("express").Router();
const postModel= require("./posts-model");

router.get("/", async(req,res)=>{
    try {
        const allPosts = await postModel.find();
        res.json(allPosts);
    }catch( error){
        res.status(500).json ({message: "Gönderiler alınamadı"})
    }
})


router.get("/:id", async(req,res)=>{
    try {
        const id = req.params.id;
        const thePost = await postModel.findById();
        if (!thePost) {
            res.status(404).json({message:"Belirtilen ID'li gönderi bulunamadı"})
        } else {
            res.json(thePost);
        }
    }catch (error){
        res.status(500).json({message:"Gönderi bilgisi alınamadı"})
    }
});

router.post ("/", async(req,res)=>{
    try {
        const { title, contents } = req.body;
        if (!title || !contents){
          res.status(400).json({message:"Lütfen gönderi için bir title ve contents sağlayın"})

        } else {
            const insertedId= await postModel.insert ({
                title: title,
                contents: contents,
            });
            const insertedPost = await postModel.findById(insertedId.id);
            res.status(201).json(insertedPost)
        }
    }catch(error){
        res.status(500).json({ message: "Veritabanına kaydedilirken bir hata oluştu"})
    }
});


router.put ("/", async (req,res)=>{
    try {
        const id = req.params.id;
        const {title, contents}= req.body;
        const thePost = await postModel.findById(id);
        if (!thePost){
            res.status(400).json({ message: "Lütfen gönderi için bir title ve contents sağlayın",})
        }else {
            await postModel.update(id, {
                title:title,
                contents:contents,
            });
            const updatedPost= await postModel.findById(id);
            res.status(201).json(updatedPost);
        }
    
    } catch (error){
        res.status(500).json({ message: "Gönderi bilgileri güncellenemedi"})
    }

});

router.delete("/", async (req,res)=>{
    try {
        const id=req.params.id;
        const thePost =await postModel.findById(id);
        if(!thePost){
            res.status(404).json({message: "Belirtilen ID'li gönderi bulunamadı" })
        } else {
            await postModel.remove(id);
            res.status(201).json(thePost)
        }
    } catch(error){
        res.status(500).json({message: "Gönderi silinemedi"})
    }
})


router.get("/", async(req,res)=>{
    try{
        const id = req.params.id;
        const thePost= await postModel.findById(id);
        if(!thePost){
            res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı" })
        }else {
            const comment =await postModel.findPostComments(id);
            res.status(201).json(comment);
        } 
         } catch(error){
            res.status(500).json({message: "Yorumlar bilgisi getirilemedi" });
        }

    
})

module.exports= router;