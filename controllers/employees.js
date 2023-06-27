const { prisma } = require('../prisma/prisma-client');

/**
 * @route GET /api/employees
 * @desc Получение всех сотрудников
 * @access Public
 */
const all = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();
        res.status(200).json(employees);
    }
    catch {
        res.status(500).json({ message: 'Не удалось получить сотрудников' })
    }
};

/**
 * @route POST /api/employees/add
 * @desc Добавление сотрудника
 * @access Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;

        if (!data.firstName || !data.lastName || !data.address || !data.age) {
            return res.status(400).json({ message: "Пожалуйста, заполните обязательные поля" });
        }

        const employee = await prisma.employee.create({
            data: {
                ...data,
                userId: req.user.id
            },
        });

        return res.status(201).json(employee);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Что-то пошло не так" });
    }
}

/**
 * @route POST /api/employees/remove/:id
 * @desc Удаление сотрудника
 * @access Private
 */
const remove = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.employee.delete({
            where: {
                id
            }
        });

        res.status(202).json({ message: "Сотрудник успешно удалён" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Что-то пошло не так" });
    }
}

/**
 * @route PUT /api/employees/edit/:id
 * @desc Изменение сотрудника
 * @access Private
 */
const edit = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;

        await prisma.employee.update({
            where: {
                id
            },
            data
        })

        res.status(202).json({ message: "Сотрудник успешно изменён" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Что-то пошло не так" });
    }
}

/**
 * @route GET /api/employees/:id
 * @desc Получение одного сотрудника
 * @access Public
 */
const employee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await prisma.employee.findUnique({
            where: {
                id
            }
        });

        res.status(200).json(employee)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Что-то пошло не так" });
    }
}

module.exports = {
    all,
    add,
    remove,
    edit,
    employee
}