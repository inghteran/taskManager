import bcrypt from "bcryptjs";

const { PrismaClient } = require('@prisma/client');
//const bcrypt = require('bcrypt'); // Usa 'bcryptjs' si es la librería que tienes instalada

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'password123';

  // Encriptar la contraseña igual que en tu backend
  const hashedPassword = await bcrypt.hash(password, 10);

  // Usar upsert para crear el usuario o actualizar su clave si ya existe
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Usuario Test', // Cambia este campo según el esquema de tu modelo User
    },
  });

  console.log('✅ Usuario de prueba creado/actualizado correctamente:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ Error al crear el usuario:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });