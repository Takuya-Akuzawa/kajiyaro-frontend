import { rest } from 'msw'

export const handlers = [
  rest.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`,
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            task_name: '洗濯',
            category: {
              id: 1,
              category_name: '衣',
            },
            status: '未着手',
            assigned_user: {
              'id': 1,
              'username': 'Narumi'
            },
            scheduled_date: '2022/06/10',
            result_date: '2022/06/10',
            result_time: 30,
          },
          {
            id: 2,
            task_name: '夕飯作る',
            category: {
              id: 2,
              category: '食',
            },
            status: '完了',
            assigned_user: {
              'id': 1,
              'username': 'Takuya'
            },
            scheduled_date: '2022/06/08',
            result_date: '2022/06/08',
            result_time: 60,
          },
        ])
      )
    })
]