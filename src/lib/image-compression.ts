export function compressImage(
    file: File,
    options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<File> {
    const maxWidth = options?.maxWidth || 1920;
    const maxHeight = options?.maxHeight || 1920;
    const quality = options?.quality || 0.82;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("No se pudo obtener el contexto 2d del canvas"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                const type = 'image/webp';
                
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            let newFileName = file.name;
                            if (newFileName.lastIndexOf('.') !== -1) {
                                newFileName = newFileName.substring(0, newFileName.lastIndexOf('.')) + '.webp';
                            } else {
                                newFileName += '.webp';
                            }
                            
                            const compressedFile = new File([blob], newFileName, {
                                type: blob.type,
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            // Fallback to jpeg
                            canvas.toBlob(
                                (fallbackBlob) => {
                                    if (fallbackBlob) {
                                        let newFileName = file.name;
                                        if (newFileName.lastIndexOf('.') !== -1) {
                                            newFileName = newFileName.substring(0, newFileName.lastIndexOf('.')) + '.jpeg';
                                        } else {
                                            newFileName += '.jpeg';
                                        }
                                        const compressedFile = new File([fallbackBlob], newFileName, {
                                            type: fallbackBlob.type,
                                            lastModified: Date.now(),
                                        });
                                        resolve(compressedFile);
                                    } else {
                                         reject(new Error("No se pudo comprimir la imagen"));
                                    }
                                },
                                'image/jpeg',
                                quality
                            );
                        }
                    },
                    type,
                    quality
                );
            };
            
            img.onerror = (error) => {
                reject(error);
            };
        };
        
        reader.onerror = (error) => {
            reject(error);
        };
    });
}
