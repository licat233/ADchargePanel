import { useForm } from 'react-hook-form'

export default function CampaignForm() {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const onSubmit = (data) => {
    console.log(data)
  }

  const errColor = (item) => {
    return item ? { borderColor: '#ff0000' } : {}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="addCampagenform">
      <div className="CampagenformContainer">
        <div>
          <input
            name="campaginName"
            placeholder="活动名称"
            ref={register({ required: true })}
            style={errColor(errors.campaginName)}
          />
          <input
            name="Account"
            placeholder="广告账户"
            ref={register({ required: true })}
            style={errColor(errors.Account)}
          />
        </div>
        <div>
          <input
            name="initialTWD"
            placeholder="初始消耗TWD"
            type="number"
            ref={register({ required: true })}
            style={errColor(errors.initialTWD)}
          />
          <input name="description" placeholder="备注" ref={register} />
        </div>
      </div>
      <div className="CampagenformSubmit">
        <input type="submit" />
      </div>
    </form>
  )
}
