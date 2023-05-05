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

async function sendEmail(email, items, date, orderNum) {
   return new Promise((resolve, reject) => {
      var emailSent = false;
      var emailContent = fs.readFileSync('./src/utils/emailReceipt.html', 'utf8');

      const populatedEmail = populate(emailContent, items, date, orderNum);

      // Send email using sendgrid
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msg = {
         to: email,
         from: 'ryan_yychen@hotmail.com',
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
            console.error(error);
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
function populate(htmlContent, items, date, orderNum) {
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

      // name (0) / qty (1) / price(2)
      for (let j = 0; j < items[i].length; j++) {
         var property = document.createElement("div");
         property.style="flex-basis:10em; flex-grow:1; text-align:center;";
         item.appendChild(property);
         var text = document.createElement("span");
         text.style="color: #80817f; font-size: 12px; font-family: inherit;";
         text.textContent=items[i][j];
         property.appendChild(text);
      }

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
   ["snack 1", "2", "$9"],
   ["snack 2", "1", "$4"],
   ["snack 3", "1", "$3"],
   ["snack 4", "3", "$10"]
];
date = "May 4, 2023";
orderNum = "20030626";
sendEmail(email, items, date, orderNum);
