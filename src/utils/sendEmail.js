var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var fs = require('fs');
var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;
function sendEmail(email, items, date, orderNum) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var emailSent = false;
                    var emailContent = fs.readFileSync('./src/utils/emailReceipt.html', 'utf8');
                    var populatedEmail = populate(emailContent, items, date, orderNum);
                    // Send email using sendgrid
                    var sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    var msg = {
                        to: email,
                        from: process.env.EMAIL_FROM,
                        subject: 'HKN Snack Bar Receipt',
                        text: 'nothing for now',
                        html: populatedEmail,
                    };
                    sgMail
                        .send(msg)
                        .then(function () {
                        emailSent = true;
                        if (emailSent) { // if email sent successfully
                            resolve(true);
                        }
                        else { // email failed to send
                            reject(new Error("Email failed to send"));
                        }
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                })];
        });
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
    var dom = new JSDOM(htmlContent);
    var document = dom.window.document;
    // Change date and orderNum
    document.getElementById("date").textContent = date;
    document.getElementById("orderNum").textContent = orderNum;
    var container = document.getElementById("overall-container");
    // For each item add name/qty/price
    for (var i = 0; i < items.length; i++) {
        var item = document.createElement("div");
        item.style = "padding:0px 40px 0px 40px; background-color:white; width:auto; line-height: 40px; display:flex;";
        container.appendChild(item);
        // add name
        var property = document.createElement("div");
        property.style = "flex-basis:10em; flex-grow:1; text-align:center;";
        item.appendChild(property);
        var text = document.createElement("span");
        text.style = "color: #80817f; font-size: 12px; font-family: inherit;";
        text.textContent = items[i].name;
        property.appendChild(text);
        // add qty
        property = document.createElement("div");
        property.style = "flex-basis:10em; flex-grow:1; text-align:center;";
        item.appendChild(property);
        text = document.createElement("span");
        text.style = "color: #80817f; font-size: 12px; font-family: inherit;";
        text.textContent = items[i].qty;
        property.appendChild(text);
        // add price
        property = document.createElement("div");
        property.style = "flex-basis:10em; flex-grow:1; text-align:center;";
        item.appendChild(property);
        text = document.createElement("span");
        text.style = "color: #80817f; font-size: 12px; font-family: inherit;";
        text.textContent = items[i].price;
        property.appendChild(text);
        // Add horizontal line as divider
        var lineContainer = document.createElement("div");
        lineContainer.style = "padding:0px 40px 0px 40px; background-color:white; width:auto;";
        container.appendChild(lineContainer);
        var line = document.createElement("div");
        line.style = "height:1px; background-color:gray";
        lineContainer.appendChild(line);
    }
    // Return HTML file as string
    var serializedHTML = dom.serialize();
    return serializedHTML;
}
// For calling the function for testing purposes
// Need to get email and items from webpage input
var email = 'ryan.yychen@gmail.com';
var items = [
    { name: "snack 1", qty: 2, price: "$9" },
    { name: "snack 2", qty: 1, price: "$4" },
    { name: "snack 3", qty: 1, price: "$3" },
    { name: "snack 4", qty: 3, price: "$10" }
];
var date = new Date(2023, 5, 4);
var orderNum = 12345678;
sendEmail(email, items, date, orderNum);
