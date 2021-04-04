require "spec"

class Stack(T)
  getter data : Array(T)

  def initialize
    @data = [] of T
  end

  def initialize(array : Array(T))
    @data = array
  end

  def push(value : T) : Nil
    @data.push(value)
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

describe Stack do
  describe "#new" do
    it "initializes stack with array" do
      stack = Stack.new([1, 2])
    end

    it "initializes empty stack" do
      stack = Stack(Int32).new
    end
  end

  describe "#peek" do
    it "returns value of the top element on the stack" do
      stack = Stack.new([1, 2])

      stack.peek.not_nil!.should be(2)
    end
  end

  describe "#push" do
    it "pushes new element on the top of the stack" do
      stack = Stack.new([1, 2])

      stack.push(3)

      stack.peek.not_nil!.should be(3)
    end
  end
end
