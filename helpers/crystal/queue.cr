require "spec"

class Queue(T)
  getter data : Array(T)

  def initialize
    @data = [] of T
  end

  def initialize(array : Array(T))
    @data = array
  end

  def push(value : T) : Nil
    @data.insert(0, value)
  end

  def pop : T?
    @data.pop?
  end

  def peek : T?
    @data[-1]?
  end

  def to_s(io)
    io << @data
  end
end
