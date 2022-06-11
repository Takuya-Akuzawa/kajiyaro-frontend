import { rest } from 'msw'

export const handlers = [
  rest.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            task_name: 'dummy task 1',
            category: {
              id: 1,
              category: '衣',
            },
            status: '未着手',
            assigned_user: 'Dummy User 1',
            scheduled_date: '2022/04/26',
            result_date: '2022/04/27',
            result_time: 30,
          },
          {
            id: 2,
            task_name: 'dummy task 2',
            category: {
              id: 2,
              category: '食',
            },
            status: '完了',
            assigned_user: 'Dummy User 2',
            scheduled_date: '2022/06/08',
            result_date: '2022/06/08',
            result_time: 60,
          },
        ])
      )
    })
]