//
// module.exports = {
//     appendToDocumentField: (doc, fields, data) => {
//         return new Promise((resolve, reject) => {
//             for (let i = 0, n = fields.length; i < n; i++) {
//                 if (!doc[s[i]]) {
//                     doc[fields[i]] = '';
//                 }
//
//                 let field = doc[fields[i]];
//                 if (field.constructor === Array) {
//                     field.push(data[i]) // Can be upgraded to check if data is array.
//                 } else {
//                     field =
//                 }
//             }
//
//             doc[field].push(data);
//             doc.save()
//                 .then(doc => resolve(doc))
//                 .catch(err => reject(err));
//         })
//     }
// };