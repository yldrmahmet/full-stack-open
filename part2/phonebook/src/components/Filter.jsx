const Filter = ({onChange}) => {
    return (
        <div>
        <form>
          <span>filter shown with</span>
          <input onChange={onChange} />
        </form>
      </div>
    )
}

export default Filter