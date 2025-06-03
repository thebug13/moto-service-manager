const { execSync } = require('child_process');
const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();
const port = 4200; // Puerto por defecto de Angular

console.log('\n🚀 Iniciando servidor de desarrollo de Angular...\n');
console.log('📱 Puedes acceder a la aplicación desde:');
console.log(`   Local:   http://localhost:${port}`);
console.log(`   Red:     http://${localIP}:${port}\n`);

// Ejecutar ng serve
execSync('ng serve', { stdio: 'inherit' }); 