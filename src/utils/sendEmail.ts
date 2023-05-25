/*
 * Takes an email and sends a purchase receipt to that email, including
 * each item's name, quantity, and price (individual price * quantity), date
 * of purchase, and order/purchase number
 * 
 * Parameters:
 *    String email: email to send receipt to
 *    Array item: array of arrays: [name, qty, price]
 *                (best if price has $ sign) (price is total price of that item)
 *    String date: date
 *    String orderNum: order number
 */
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function sendEmail(email: string, items: {name: string, qty: number, price: string}[], date: Date, orderNum: number) {
   return new Promise((resolve, reject) => {
      var emailSent = false;
      var emailContent = fs.readFileSync('./src/utils/emailReceipt.html', 'utf8');

      const populatedEmail = populate(emailContent, items, date, orderNum);

      // Send email using sendgrid
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
         to: email,
         from: process.env.EMAIL_FROM,
         subject: 'HKN Snack Bar Receipt',
         text: 'nothing for now',
         html: populatedEmail,
      }
      sgMail
         .send(msg)
         .then(() => {
            emailSent = true;
            if (emailSent) { // if email sent successfully
               resolve(true);
            } else { // email failed to send
               reject(new Error("Email failed to send"));
            }
         })
         .catch((error) => {
            reject(error);
         })
   });
}

/*
 * Takes the items array and strings date and orderNum and populate the email's
 * HTML file accordingly.
 * 
 * Parameters:
 *    String htmlContent: string of the HTML file's contents
 *    Array item: array of arrays: [name, qty, price]
 *                (best if price has $ sign) (price is total price of that item)
 *    String date: date
 *    String orderNum: order number
 */
function populate(htmlContent, items: {name: string, qty: number, price: string}[], date: Date, orderNum: number) {
   // Generate JSDOM to be able to edit HTML
   const dom = new JSDOM(htmlContent);
   const document = dom.window.document;

   // Change date and orderNum
   document.getElementById("date").textContent = date;
   document.getElementById("orderNum").textContent = orderNum;

   var container = document.getElementById("overall-container");
   // For each item add name/qty/price
   for (let i = 0; i < items.length; i++) {
      var item = document.createElement("div");
      item.style="padding:0px 40px 0px 40px; background-color:white; width:auto; line-height: 40px; display:flex;";
      container.appendChild(item);

      // add name
      var property = document.createElement("div");
      property.style="flex-basis:10em; flex-grow:1; text-align:center;";
      item.appendChild(property);
      var text = document.createElement("span");
      text.style="color: #80817f; font-size: 12px; font-family: inherit;";
      text.textContent=items[i].name;
      property.appendChild(text);

      // add qty
      property = document.createElement("div");
      property.style="flex-basis:10em; flex-grow:1; text-align:center;";
      item.appendChild(property);
      text = document.createElement("span");
      text.style="color: #80817f; font-size: 12px; font-family: inherit;";
      text.textContent=items[i].qty;
      property.appendChild(text);

      // add price
      property = document.createElement("div");
      property.style="flex-basis:10em; flex-grow:1; text-align:center;";
      item.appendChild(property);
      text = document.createElement("span");
      text.style="color: #80817f; font-size: 12px; font-family: inherit;";
      text.textContent=items[i].price;
      property.appendChild(text);

      // Add horizontal line as divider
      var lineContainer = document.createElement("div");
      lineContainer.style="padding:0px 40px 0px 40px; background-color:white; width:auto;";
      container.appendChild(lineContainer);
      var line = document.createElement("div");
      line.style="height:1px; background-color:gray";
      lineContainer.appendChild(line);
   }
   // Return HTML file as string
   const serializedHTML = dom.serialize();
   return serializedHTML;
}

// For calling the function for testing purposes
// Need to get email and items from webpage input
var email = 'ryan.yychen@gmail.com';
var items = [
   {name: "snack 1", qty: 2, price: "$9"},
   {name: "snack 2", qty: 1, price: "$4"},
   {name: "snack 3", qty: 1, price: "$3"},
   {name: "snack 4", qty: 3, price: "$10"}
];
var date = new Date(2023, 5, 4);
var orderNum = 12345678;
sendEmail(email, items, date, orderNum);
