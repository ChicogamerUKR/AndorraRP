const Discord = require('discord.js');
const mongoose = require('mongoose');

// Conectar a la base de datos (asegúrate de tener MongoDB instalado y en ejecución)
mongoose.connect('mongodb+srv://AndorraRP:Erikprol22@andorrarp.4xxpmah.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el modelo de usuario
const User = mongoose.model('User', {
    userId: String,
    money: Number,
    inventory: [String]
});

const client = new Discord.Client();
const prefix = '!'; // Puedes cambiar el prefijo según tus preferencias

client.on('message', async message => {
    if (message.author.bot || !message.guild) return;

    // Obtener o crear el usuario en la base de datos
    let user = await User.findOne({ userId: message.author.id });
    if (!user) {
        user = new User({ userId: message.author.id, money: 0, inventory: [] });
        await user.save();
    }

    // Comandos
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'work':
                const earnings = 500; // Puedes ajustar la cantidad ganada
                user.money += earnings;
                await user.save();
                message.reply(`Has trabajado y ganado ${earnings} monedas.`);
                break;

            case 'dep':
                const amount = args[0].toLowerCase() === 'all' ? user.money : parseInt(args[0]);
                if (isNaN(amount) || amount <= 0) {
                    return message.reply('Por favor, introduce una cantidad válida.');
                }

                if (amount > user.money) {
                    return message.reply('No tienes suficiente dinero en mano.');
                }

                user.money -= amount;
                user.inventory.push(amount);
                await user.save();
                message.reply(`Has depositado ${amount} monedas en el banco.`);
                break;

            // Otros comandos como 'pay', 'with', 'shop', 'add-shop', 'buy-item', 'inv', 'sell-item', etc.
            // Debes implementar estos comandos de acuerdo a tus necesidades.

            default:
                break;
        }
    }
});

client.login('MTE4Nzc4NDY3NzcwNTEzNDIwMA.GGvmih.rGCOtBhrzx-GCGbejKZRyJPc3LeGSiXk7Y6UV8');
