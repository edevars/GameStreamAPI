const boom = require('@hapi/boom')
const { Dropbox } = require('dropbox');
const bcrypt = require('bcrypt');
const { config } = require('../config');



const uploadDropboxImage = async (req, res, next, file) => {
    const extensionPattern = /.png|.jpg/g;
    const extension = file.name.match(extensionPattern)

    if(!extension){
        next(boom.forbidden("You didn't uploaded an image"))
        return null;
    }

    try {
        const UPLOAD_FILE_SIZE_LIMIT = 5 * 1024 * 1024;

        if (file.size < UPLOAD_FILE_SIZE_LIMIT) {
            const dbx = new Dropbox({ accessToken: config.accessToken });

            
            let hashedName = await bcrypt.hash(file.name, 5)
            hashedName = hashedName.replace('/','')
            const newName = hashedName + extension

            const { result: uploadedFile } = await dbx.filesUpload({ path: '/users/' + newName, contents: file.data })

            const { result: sharedLink } = await dbx.sharingCreateSharedLinkWithSettings({
                path: uploadedFile.path_display, settings: {
                    requested_visibility: "public"
                }
            })

            let hash = `${sharedLink.url}`
            hash = hash.replace('https://www.dropbox.com/s/', '')
            hash = hash.replace('?dl=0', '')
            const prefix = 'https://dl.dropboxusercontent.com/s/'
            const publicUrl = prefix + hash

            return publicUrl
        } else {
            next(boom.forbidden("The image is greater than 5 Mb"))
        }
    } catch (error) {
        next(error)
    }


}

module.exports = uploadDropboxImage