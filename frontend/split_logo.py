import os
from PIL import Image

def process_logo():
    path = "/home/baran/.gemini/antigravity/brain/3eb240fc-f347-4eb3-856e-9da6b44a3213/media__1783269171397.jpg"
        
    img = Image.open(path)
    width, height = img.size
    
    # Top-left: Full Logo
    box1 = (56, 56, 456, 456)
    logo1 = img.crop(box1)
    
    # Top-right: Emblem
    box2 = (568, 56, 968, 456)
    logo2 = img.crop(box2)
    
    # Bottom-left: App Icon
    box3 = (56, 568, 456, 968)
    logo3 = img.crop(box3)

    # Save them
    logo1.save("/home/baran/.gemini/antigravity/scratch/Cinebee-Social/frontend/public/full_logo.png")
    logo2.save("/home/baran/.gemini/antigravity/scratch/Cinebee-Social/frontend/public/emblem.png")
    logo3.save("/home/baran/.gemini/antigravity/scratch/Cinebee-Social/frontend/public/app_icon.png")

    print("Cropped successfully!")

process_logo()
