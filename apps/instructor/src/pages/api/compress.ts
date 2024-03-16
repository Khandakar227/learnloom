import { NextApiRequest, NextApiResponse } from "next";
import sharp from 'sharp';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { image } = req.body;
        if(!image) return res.status(400).json({error: true, message: "No image provided"});
        
        const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    
        // Sharp for image processing and compression
        const compressedImageBuffer = await sharp(imageBuffer)
            .resize({height: 560, width:315, fit: 'inside'})
            .jpeg({ quality: 80 }) // Adjust compression level as needed
            .toBuffer();
    
        const compressedBase64 = compressedImageBuffer.toString('base64');
        const compressedImageData = `data:image/jpeg;base64,${compressedBase64}`;
        res.status(200).json({ error: false, image: compressedImageData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to compress image' });
    }
}

export default handler;